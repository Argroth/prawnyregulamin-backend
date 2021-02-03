const orderController = require('../controller/order-controller');
const apiMiddleware = require('../middleware/validateapi-middleware');

module.exports = (app) => {
    app.post('/order', apiMiddleware.validateAPI, orderController.getOrders);
    app.post('/order/create', orderController.createOrder);
    app.post('/order/notify', orderController.oderNotify);
    app.post('/order/close', apiMiddleware.validateAPI, orderController.closeOrder);
};