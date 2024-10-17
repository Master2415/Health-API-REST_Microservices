const Microservice = require('../models/microservice');
const Log = require('../models/log');
const { database } = require('../database/connection');
const axios = require('axios');

const { sendLog } = require('../communication/communication');

module.exports = {
    registerService_handler,
    GetAllHealth_handler,
    GetHealthByService_handler
};

async function registerService_handler(req, res) {
    try {
        const data = req.body;
        const log = new Log();

        if (typeof data.name !== 'string' || typeof data.endpoint !== 'string' || typeof data.email !== 'string') {

            log.app_name = "HEALTH-API";
            log.log_type = "ERROR";
            log.module = "ADD-SERVICE";
            log.log_date_time = new Date().toISOString();
            log.summary = "Failed to register a service";
            log.description = "An invalid/empty field in information";
            sendLog(log);

            return res.status(400).send(`Error: name, endpoint, and email must be strings`);
        }

        if (!Number.isInteger(data.frequency)) {
            log.app_name = "HEALTH-API";
            log.log_type = "ERROR";
            log.module = "ADD-SERVICE";
            log.log_date_time = new Date().toISOString();
            log.summary = "Failed to register a service";
            log.description = "An invalid frequency information";
            sendLog(log);

            return res.status(400).send(`Error: Frequency must be Integer`);
        }

        const microservice = new Microservice();

        microservice.name = data.name;
        microservice.endpoint = data.endpoint;
        microservice.frequency = data.frequency;
        microservice.email = data.email;

        await database.create(microservice);

        log.app_name = "HEALTH-API";
        log.log_type = "INFO";
        log.module = "ADD-SERVICE";
        log.log_date_time = new Date().toISOString();
        log.summary = "Service registrated successfully";
        log.description = "An service was registrated successfully";
        sendLog(log);

        return res.status(200).send("OK: Service was registered successfully");
    } catch (error) {

        const log = new Log();
        log.app_name = "HEALTH-API";
        log.log_type = "ERROR";
        log.module = "ADD-SERVICE";
        log.log_date_time = new Date().toISOString();
        log.summary = "Failed to register a service";
        log.description = "Unexpected error: " + error.message;
        sendLog(log);
        return res.status(400).send("Error: Unexpected error: " + error.message);
    }
}


async function GetAllHealth_handler(req, res) {
    try {
        const microservices = await database.findAll({ raw: true });
        const responses = [];
        const log = new Log();

        for (const service of microservices) {
            try {
                const response = await axios.get(service.endpoint);
                responses.push({
                    serviceName: service.name,
                    response: response.data
                });
            } catch (error) {
                responses.push({
                    serviceName: service.name,
                    error: "Out of service"
                });
            }
        }

        log.app_name = "HEALTH-API";
        log.log_type = "INFO";
        log.module = "ADD-SERVICE";
        log.log_date_time = new Date().toISOString();
        log.summary = "Services health geted successfully";
        log.description = "All services health was geted successfully";
        sendLog(log);

        return res.status(200).send(responses);

    } catch (error) {
        return res.status(400).send({ error: `Unexpected error: ${error.message}` });
    }
}

async function GetHealthByService_handler(req, res) {
    try {
        const log = new Log();
        const serviceName = req.params.microservice;
        console.log("SERVICIO: " + serviceName);
        const service = await database.findOne({ where: { name: serviceName }, raw: true });
        console.log("SERVICIO DATA: ", service);

        if (!service) {
            console.log("FALLO BD");

            log.app_name = "HEALTH-API";
            log.log_type = "INFO";
            log.module = "GET-HEALTH-BY-SERVICE";
            log.log_date_time = new Date().toISOString();
            log.summary = "Service is not found";
            log.description = `Service of '${serviceName}' is not registred`;
            sendLog(log);

            return res.status(404).send(`Service '${serviceName}' not found.`);
        }

        let response;
        try {
            const status = await axios.get(service.endpoint);
            response = {
                serviceName: service.name,
                response: status.data
            };
        } catch (error) {
            response = {
                serviceName: service.name,
                response: "Out of service"
            };
        }

        log.app_name = "HEALTH-API";
        log.log_type = "INFO";
        log.module = "GET-HEALTH-BY-SERVICE";
        log.log_date_time = new Date().toISOString();
        log.summary = "Service health retrieved successfully";
        log.description = `Health status of service '${serviceName}' retrieved successfully`;
        sendLog(log);

        return res.status(200).send(response);
    } catch (error) {
        const log = new Log();
        log.app_name = "HEALTH-API";
        log.log_type = "ERROR";
        log.module = "GET-HEALTH-BY-SERVICE";
        log.log_date_time = new Date().toISOString();
        log.summary = "Failed to retrieve service health";
        log.description = `Error occurred while retrieving health status for service': ${error.message}`;
        sendLog(log);

        return res.status(400).send({ error: `Unexpected error: ${error.message}` });
    }
}

