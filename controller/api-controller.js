const crypto = require('crypto');

const API = require('../model/api-model');

exports.generateAPI = (req, res) => {
    const newAPI = new API();
    newAPI.name = "prawnyregulamin";
    newAPI.key = crypto.randomBytes(16).toString('hex');
    newAPI.save();

    res.json('Api created');
};