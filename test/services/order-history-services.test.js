const { getOrderHistoryService, processOrderFile } = require('../../src/services/order-history-services');
const { getOrderHistory, saveOrders } = require('../../src/repositories/order-history-repository');

jest.mock('../../src/repositories/order-history-repository');

describe('getOrderHistoryService', () => {
    it('should call getOrderHistory with the correct parameters', async () => {
        getOrderHistory.mockResolvedValue([{ order_id: 1, user_id: 123, date: '2024-02-01' }]);
        
        const orders = await getOrderHistoryService(1, '2024-02-01', '2024-02-10', 123);
        
        expect(getOrderHistory).toHaveBeenCalledWith({
            order_id: 1,
            date: { $gte: '2024-02-01', $lte: '2024-02-10' },
            user_id: 123
        });
        
        expect(orders).toEqual([{ order_id: 1, user_id: 123, date: '2024-02-01' }]);
    });
});

describe('processOrderFile', () => {
    it('should correctly process an order file', async () => {
        const fileContent = `0000000070                              Palmer Prosacco00000007530000000003     1836.7420210308\n` +
                            `0000000070                              Palmer Prosacco00000007530000000003     1009.5420210308`;
        
        saveOrders.mockResolvedValue();
        
        await processOrderFile(fileContent);
        
        expect(saveOrders).toHaveBeenCalledWith([
            {
                user_id: 70,
                name: 'Palmer Prosacco',
                order_id: 753,
                total: 2846.28,
                date: '2021-03-08',
                products: [
                    { product_id: 3, value: '1836.74' },
                    { product_id: 3, value: '1009.54' }                    
                ]
            }
        ]);
    });
});
