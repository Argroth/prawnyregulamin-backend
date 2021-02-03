const indexController = require('../controller/index-controller');

module.exports = (app) => {
    app.get('/', indexController.index);
};