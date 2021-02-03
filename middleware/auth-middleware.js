const jwt = require('jsonwebtoken');
const secret = process.env.AUTH_SECRET;

const User = require('../model/auth-model');


exports.withAuth = (req, res, next) => {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token;

    if (!token) {
        req.error = 401;
        req.errorMessage = 'Unauthorized: No token provided';
        next();
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                req.error = 404;
                req.errorMessage = 'Token not decoded';
                next();
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
};