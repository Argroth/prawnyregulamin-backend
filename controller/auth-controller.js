const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/auth-model');
require('../emailer/emailer-config');
//TODO Change secret to env variable
const secret = process.env.AUTH_SECRET;

exports.register = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            res.json('There was an error while creating new user');
        }else if(user){
            res.json('User with that email already exists');
        } else {
            const newUser = new User();
            newUser.email = req.body.email;
            newUser.password = bcrypt.hashSync(req.body.password, 10, null);

            newUser.save((err) => {
                if (err)
                    console.log(err)
                return (newUser);
            });

            res.json('User created!');        }
    });
};

exports.login = (req, res) => {
    const email = req.body.user.email;
    const password = req.body.user.password;
    User.findOne({email: email},(err, user) => {
        if(!user){
            res.status(202).json('Brak takiego użytkownika');
        }
        else if(user) {
            bcrypt.compare(password, user.password, (err, passwordIsTheSame) => {
                if (passwordIsTheSame === false) {
                    res.status(202).json('Hasło nieprawidłowe');
                } else if (passwordIsTheSame === true) {
                    const payload = { email };
                    const token = jwt.sign(payload, secret, {
                        expiresIn: '24h'
                    });
                    res.cookie('token', token, { httpOnly: true }).sendStatus(200);
                }
            });
        }
    });
};

exports.logout = (req, res) => {
    res.clearCookie('token').status(200).json('User Logged out');
};


exports.authMiddlewareResponse = (req, res) => {
    if(req.email){
        res.json('Authorized');
    }else{
        res.json('Unauthorized');
    }
};