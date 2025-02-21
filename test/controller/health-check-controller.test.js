const request = require('supertest');
const express = require('express');
const healthCheckRouter = require('../../src/controller/health-check-controller');

const app = express();
app.use('/', healthCheckRouter);

describe('Health Check Endpoint', () => {
    it('should return status 200 and JSON with status "Server running"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'Server runing' });
    });
});