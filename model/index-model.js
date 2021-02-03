const mongoose = require('mongoose');

const indexSchema = mongoose.Schema({
    name: {type: String, default: null}
});

module.exports = mongoose.model('Index', indexSchema);