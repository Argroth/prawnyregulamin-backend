const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {type: String, default: null},
    link: {type: String, default: null},
    shortDesc: {type: String, default: null},
    content: {type: String, default: null}
});

module.exports = mongoose.model('Blog', blogSchema);