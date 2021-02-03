const clientController = require('../controller/customer-controller');
const apiMiddleware = require('../middleware/validateapi-middleware');

module.exports = (app) => {
    app.post('/customers', apiMiddleware.validateAPI, clientController.getAllCustomers);
    app.post('/customers/create', apiMiddleware.validateAPI, clientController.createCustomer);
    app.post('/customers/delete', apiMiddleware.validateAPI, clientController.deleteCustomer);
    app.post('/customers/update', apiMiddleware.validateAPI, clientController.updateCustomer);
};