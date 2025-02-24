const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product_id: Number,
    value: String
},
{
    _id: false
});

const OrderSchema = new mongoose.Schema({
    user_id: Number,
    name: String,
    order_id: Number,
    total: String,
    date: String,
    products: [ProductSchema]
});


OrderSchema.index({ user_id: 1  });
OrderSchema.index({ order_id: 1 });
OrderSchema.index({ date: 1 });


module.exports = mongoose.model('OrderHistory', OrderSchema);
