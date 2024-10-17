const express = require('express');
const bodyParser = require('body-parser');
const handler = require('./handlers/apiFunctions_handler');
const {databaseConnection } = require('./database/connection');
const {initMonitoring } = require('./monitoring/monitoring');

const app = express();
const PORT = 8082;

databaseConnection();
initMonitoring();

app.use(bodyParser.json());

app.post('/health/add', handler.registerService_handler);
app.get('/health/all', handler.GetAllHealth_handler);
app.get('/health/:microservice', handler.GetHealthByService_handler);

const server = app.listen(PORT, () => {
    console.log(`----------INIT HEALTH SERVER ${PORT} at: ${new Date().toLocaleTimeString()}----------`);
});

server.on('error', (err) => {
    console.error('Error starting server:', err);
});
