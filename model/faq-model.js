const mongoose = require('mongoose');

const faqSchema = mongoose.Schema({
    question: {type: String, default: null},
    answer: {type: String, default: null}
});

module.exports = mongoose.model('FAQ', faqSchema);