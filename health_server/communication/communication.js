const { connect, StringCodec } = require('nats');

const NATS_HOSTS = process.env.HS_NATS_SERVER || "localhost";
const natsURL = `nats://${NATS_HOSTS}:4222`;

async function communication() {

  try {
    const nc = await connect({ servers: natsURL });
    return nc;
  } catch (err) {
    console.error('Error connecting to NATS:', err);
    throw err;
  }
}

async function sendLog(log) {
  try {
    const sc = StringCodec();
    const communicate = await communication();
    const jsonData = JSON.stringify(log);
    communicate.publish("HealthServer", sc.encode(jsonData));
  } catch (error) {
    console.error('Error while sending log:', error);
  }
}

module.exports = {
  communication,
  sendLog
};