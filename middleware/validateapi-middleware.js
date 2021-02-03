const API = require('../model/api-model');

exports.validateAPI = (req, res, next) => {
    API.findOne({key: req.body.api}, (err, apiFound) => {
        if(apiFound && apiFound.active === true){
            next();
        }else{
            res.json('Wrong API Key!');
        }
    });
};