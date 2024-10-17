const { database } = require('../database/connection');
const axios = require('axios');
const nodemailer = require('nodemailer');
const {transporter} = require('./mailer');

let isEmailSend = {
    live: false,
    ready: false
};

async function initMonitoring() {
    const microservices = await database.findAll({ raw: true });

    if (microservices.length === 0) {
        console.log("No applications found. Monitoring will not start.");
    } else {
        for (const app of microservices) {
            periodicRequest(app.name, app.endpoint, app.frequency, app.email);
        }
    }
}

async function periodicRequest(appName, endpoint, frequency, email) {
    const mailer = true;
    while (true) {
        try {
            console.log(appName, " => Init verification\n");
            const response = await axios.get(endpoint);
            if (mailer) {
                checkHealth(appName, response, email);
            }else{
                console.log(appName, response.data);
            }
        } catch (error) {
            if (mailer){
                checkHealth(appName, "Out of service", email);
            }else{
                console.log(appName, "Out of service");
            } 
        }
        await sleep(frequency);

    }
}

async function checkHealth(appName, result, email) {
    if (result === "Out of service") {
        const subject = "ALERT: API out of service! [ " + appName + " ]";
        const body = "La aplicación " + appName + " está fuera de servicio.";
        await sendEmail(subject, body, email);
        console.log('Sending email API out of service');
        return;
    }

    if ('live' in result && result.live.status === 'DOWN' && !isEmailSend.live) {
        const subject = "Alerta: Estado LIVE en DOWN [ " + appName + " ]";
        const body = JSON.stringify(result.live, null, 4);
        console.log('Sending email live is DOWN');
        isEmailSend.live = true;
    }

    if ('ready' in result && result.ready.status === 'DOWN' && !isEmailSend.ready) {
        const subject = "Alerta: Estado READY en DOWN [ " + appName + " ]";
        const body = JSON.stringify(result.ready, null, 4);
        console.log('Sending email ready is DOWN');
        isEmailSend.ready = true;
    }

    if ('live' in result && result.live.status !== 'DOWN') {
        isEmailSend.live = false;
    }

    if ('ready' in result && result.ready.status !== 'DOWN') {
        isEmailSend.ready = false;
    }
}

async function sendEmail(subject, body, toEmail) {

    let mailOptions = {
        from: 'correoReal@gmail.com',
        to: toEmail,
        subject: subject,
        text: body
    };

    try {
        console.log('Intento enviar correo!');
        let info = await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado:', info.response);
        return true;
    } catch (error) {
        console.log('Error al enviar el correo:', error);
        return false;
    }
}

function sleep(ms) {
    const seconds = ms;
    ms = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {initMonitoring, checkHealth};