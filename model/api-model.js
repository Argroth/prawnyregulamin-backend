const mongoose = require('mongoose');

const apiSchema = mongoose.Schema({
    name: {type: String, default: null},
    key: {type: String, default: null},
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model('API', apiSchema);