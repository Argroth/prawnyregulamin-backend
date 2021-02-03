const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    firstName: {type: String, default: null},
    lastName: {type: String, default: null},
    email: {type: String, default: null},
    telephone: {type: String, default: null},
    description: {type: String, default: null},
    customerDescription: {type: String, default: null},
    order: {type: String, default: null},
    orderId: {type: String, default: null},
    orderCreateDate: {type: String, default: null},
    ourOrderId: {type: String, default: null},
    totalAmount: {type: String, default: null},
    paymentStatus: {type: String, default: 'PENDING'},
    orderStatus: {type: String, default: "Nowe", enum: ["Nowe",  "Zrealizowane"]},
});

module.exports = mongoose.model('Order', orderSchema);