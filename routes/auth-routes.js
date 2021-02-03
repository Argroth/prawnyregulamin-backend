const authController = require('../controller/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');

module.exports = (app) => {
    app.post('/auth/login', authController.login);
    app.post('/auth/logout', authController.logout);
    //app.post('/auth/register', authController.register);
    app.post('/auth/check-user-token', authMiddleware.withAuth, authController.authMiddlewareResponse);
};