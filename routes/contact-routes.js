const contactController = require('../controller/contact-controller');
const apiMiddleware = require('../middleware/validateapi-middleware');

module.exports = (app) => {
    app.post('/contact', apiMiddleware.validateAPI, contactController.getAllQuestions);
    app.post('/contact/create', contactController.createQuestion);
    app.post('/contact/answer', apiMiddleware.validateAPI, contactController.answerQuestion);
}