const faqController = require('../controller/faq-controller');
const apiMiddleware = require('../middleware/validateapi-middleware');

module.exports = (app) => {
    app.get('/faq', faqController.getAllFaqs);
    app.post('/faq/create', apiMiddleware.validateAPI, faqController.createFaq);
    app.post('/faq/update', apiMiddleware.validateAPI, faqController.updateFaq);
    app.post('/faq/delete', apiMiddleware.validateAPI, faqController.deleteFaq);
};