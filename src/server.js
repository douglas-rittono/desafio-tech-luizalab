const express = require('express');
const config = require('./config');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger-config');


const healthCheckController = require('./controller/health-check-controller');
const orderHistoryController = require('./controller/order-history-controller');
const connectDB = require('./config/database');

connectDB();

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/health', healthCheckController);
app.use('/api/orders', orderHistoryController);

app.listen(config.port, () => {
    console.log(`Server listening at http://localhost:${config.port}`);
});

