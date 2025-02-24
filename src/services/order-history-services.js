const { getOrderHistory, saveOrders } = require('../repositories/order-history-repository');

const orderList = new Map();

async function getOrderHistoryService(orderId, startDate, endDate, userId) {
    let query = {};
    if(orderId){
        query["order_id"] = Number(orderId);
    }
    if (startDate && endDate) {
        query["date"] = { $gte: startDate, $lte: endDate };
    }
    if(userId){
        query["user_id"] = Number(userId);
    }
    
    const orders = await getOrderHistory(query);
    return orders
}

async function groupOrdersByUserId(lines) {
    const orders = [];

    lines.forEach(line => {
        if(line.length < 95) {
            return;
        }
        const record = parseOrderLine(line);

        let order = orders.find(o => o.order_id === record.order_id);
        
        if (!order) {
            order = {
                user_id: record.user_id,
                name: record.name,
                order_id: record.order_id,
                total: 0,
                date: record.date,
                products: []
            };    

            order.products.push({
                product_id: record.product_id,
                value: record.value
            });

            order.total = parseFloat(order.total) + parseFloat(record.value);
    
            orders.push(order);        
        }else{
            order.products.push({
                product_id: record.product_id,
                value: record.value
            });

            order.total = parseFloat(order.total) + parseFloat(record.value);
        }              
    });

    orders.forEach(order => {
        order.total = parseFloat(order.total.toFixed(2));
    });

    return orders;
}

async function processOrderFile(fileContent) {
    const lines = fileContent.split('\n');

    const orders = await groupOrdersByUserId(lines);

    await saveOrders(orders);
}  

function parseOrderLine(line) {
    return {
        user_id: Number(line.substring(0, 10).trim()), 
        name: line.substring(10, 55).trim(),
        order_id: Number(line.substring(55, 65).trim()),
        product_id: Number(line.substring(65, 75).trim()),
        value: parseFloat(line.substring(75, 87).trim()).toFixed(2),
        date: formatDate(line.substring(87, 95).trim())
    };
}

function formatDate(yyyymmdd) {
    return `${yyyymmdd.substring(0, 4)}-${yyyymmdd.substring(4, 6)}-${yyyymmdd.substring(6, 8)}`;
}

module.exports = { getOrderHistoryService, processOrderFile };