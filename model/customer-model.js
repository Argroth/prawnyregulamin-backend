const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {type: String, default: null},
    lastName: {type: String, default: null},
    email: {type: String, default: null},
    telephone: {type: Number, default: null},
    status: {type: String, default: "aktywny", enum: ["aktywny",  "nieaktywny"]},
    customer: {type: String, default: "aktywny", enum: ["aktywny",  "potencjalny"]},
});

module.exports = mongoose.model('Customer', customerSchema);