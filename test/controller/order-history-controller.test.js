const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

const orderHistoryRouter = require('../../src/controller/order-history-controller');
const { getOrderHistoryService, processOrderFile } = require('../../src/services/order-history-services');

jest.mock('../../src/services/order-history-services');


const app = express();
app.use(express.json());
app.use('/', orderHistoryRouter);

describe('Order History Controller', () => {
    describe('GET /', () => {
        it('should return 200 and user orders', async () => {
            const mockOrders = [
                { user_id: 70, name: 'Palmer Prosacco', orders: [] }
            ];
            getOrderHistoryService.mockResolvedValue(mockOrders);

            const response = await request(app).get('/').query({ userId: 1 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockOrders.map(item => ({
                user_id: item.user_id,
                name: item.name,
                orders: item.orders
            })));
        });

        it('should return 404 if no orders found', async () => {
            getOrderHistoryService.mockResolvedValue(null);

            const response = await request(app).get('/').query({ userId: 1 });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Nenhum pedido encontrado." });
        });

        it('should return 500 on server error', async () => {
            getOrderHistoryService.mockRejectedValue(new Error());

            const response = await request(app).get('/').query({ userId: 1 });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: {} });
        });
    });

    describe('POST /', () => {
        it('should return 200 and success message on file upload', async () => {
            processOrderFile.mockResolvedValue();

            const response = await request(app)
                .post('/')
                .attach('file', Buffer.from('file content'), 'test.txt');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Arquivo processado com sucesso." });
        });

        it('should return 400 if no file is uploaded', async () => {
            const response = await request(app).post('/');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "Nenhum arquivo enviado." });
        });

        it('should return 500 on server error', async () => {
            processOrderFile.mockRejectedValue(new Error());

            const response = await request(app)
                .post('/')
                .attach('file', Buffer.from('file content'), 'test.txt');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: {} });
        });

        it('should log an error if file deletion fails', async () => {
            const mockFileContent = 'file content';
            const mockFilePath = 'uploads/test.txt';
            fs.writeFileSync(mockFilePath, mockFileContent);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            fs.unlink = jest.fn((path, callback) => {
            callback(new Error('Erro ao excluir arquivo.'));
            });

            processOrderFile.mockResolvedValue();

            const response = await request(app)
            .post('/')
            .attach('file', Buffer.from(mockFileContent), 'test.txt');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Arquivo processado com sucesso." });
            expect(consoleSpy).toHaveBeenCalledWith('Erro ao excluir arquivo.');

            fs.unlinkSync(mockFilePath);
            consoleSpy.mockRestore();
        });
    });
});