const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: {type: String, default: null},
    lastName: {type: String, default: null},
    email: {type: String, default: null},
    telephone: {type: Number, default: null},
    question: {type: String, default: null},
    answer: {type: String, default: null},
    status: {type: String, default: "nowe", enum: ['nowe', 'odpowiedziane']}
});

module.exports = mongoose.model('Contact', contactSchema);