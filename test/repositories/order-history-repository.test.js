const { getOrderHistory, saveOrders } = require('../../src/repositories/order-history-repository');
const OrderHistory = require('../../src/models/order-history');

jest.mock('../../src/models/order-history');

describe('saveOrders', () => {
    it('should call OrderHistory.bulkWrite with correctly formatted orders', async () => {
        const ordersData = [
            { order_id: 753, user_id: 70, total: 200, date: '2024-02-01', products: [] }
        ];
        OrderHistory.bulkWrite.mockResolvedValue();

        await saveOrders(ordersData);

        expect(OrderHistory.bulkWrite).toHaveBeenCalledWith([
            {
                updateOne: {
                    filter: { order_id: 753 },
                    update: { $set: ordersData[0] },
                    upsert: true
                }
            }
        ]);
    });
});

describe('getOrderHistory', () => {
    it('should call OrderHistory.aggregate with the correct pipeline', async () => {
        const query = { user_id: 70 };
        const mockResult = [{ user_id: 70, name: 'Palmer Prosacco', orders: [] }];
        OrderHistory.aggregate.mockResolvedValue(mockResult);

        const result = await getOrderHistory(query);

        expect(OrderHistory.aggregate).toHaveBeenCalledWith([
            { $match: query },
            { $sort: { user_id: 1, order_id: 1 } },
            {
                $group: {
                    _id: "$user_id",
                    name: { $first: "$name" },
                    orders: {
                        $push: {
                            order_id: "$order_id",
                            total: "$total",
                            date: "$date",
                            products: "$products"
                        }
                    }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    user_id: "$_id",
                    name: 1,
                    orders: 1,
                    products: 1
                }
            }
        ]);
        expect(result).toEqual(mockResult);
    });
});
