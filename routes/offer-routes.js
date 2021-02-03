const offerController = require('../controller/offer-controller');

module.exports = (app) => {
    app.get('/offer', offerController.getAllOffers);
    app.post('/offer', offerController.createOffer);
    app.post('/offer/answer/customer', offerController.addAnswerfromCustomer);
    app.post('/offer/answer/owner', offerController.addAnswerfromOwner);
    app.post('/offer/close', offerController.markAsClosed);
};