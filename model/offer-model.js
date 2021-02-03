const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    name: {type: String, default: null},
    lastName: {type: String, default: null},
    telephone: {type: Number, default: null},
    email: {type: String, default: null},
    vatID: {type: String, default: null},
    description: {type: String, default: null},
    answers: [],
    status: {type: String, default: "nowa", enum: ['nowa', 'odpowiedziano', 'zakonczona']}
});

module.exports = mongoose.model('Offer', offerSchema);