const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    title: {type: String, default: null},
    shortDesc: {type: String, default: null},
    content: {type: String, default: null}
});

module.exports = mongoose.model('Log', logSchema);