const OrderHistory = require('../models/order-history');

async function saveOrders(ordersData) {
    const bulkOps = ordersData.map(orderData => ({
        updateOne: {
            filter: { order_id: orderData.order_id },
            update: { $set: orderData },
            upsert: true
        }
    }));

    try {
        await OrderHistory.bulkWrite(bulkOps);
    } catch (error) {
        console.log(error);
    }
}

async function getOrderHistory(query) {    
    const matchStage = { $match: query }
    const result = await OrderHistory.aggregate([
        matchStage,
        {
            $sort: { user_id:1, order_id: 1 }
        },
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
        {
            $sort: { _id: 1 }
        },
        {
            $project: {
                _id: 0,
                user_id: "$_id",
                name: 1,
                orders: 1,
                products: 1
            }
        }            
    ])
    return result;
}

module.exports = { getOrderHistory, saveOrders };
