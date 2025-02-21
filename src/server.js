const express = require('express');
const config = require('./config');

const healthCheckController = require('./controller/health-check-controller');


const app = express();
app.use(express.json());
app.use('/api/health', healthCheckController);

app.listen(config.port, () => {
    console.log(`Server listening at http://localhost:${config.port}`);
});

