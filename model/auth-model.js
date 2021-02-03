const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const authSchema = new mongoose.Schema({
    email : {type: String, default: "345"},
    password : {type: String, default: "123"},
    authToken: {
        tokenID: {type: String, default: null},
        expDate: String,
        isVerified: {type: Boolean, default: false}
    },
});


authSchema.methods.isCorrectPassword = (password) => {
    bcrypt.compare(password, this.password, (err, same) => {
        if (err) {
            console.log(err);
        } else {
            console.log(err, same);
        }
    });
};

module.exports = mongoose.model('Auth', authSchema);
