const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const app = express();

dotenv.config();

// Serve the static files from the React app
//app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('test'));
app.use(helmet());
app.set("trust proxy", true);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require('./routes/index-routes')(app);
require('./routes/customer-routes')(app);
require('./routes/contact-routes')(app);
require('./routes/offer-routes')(app);
require('./routes/faq-routes')(app);
require('./routes/blog-routes')(app);
require('./routes/order-routes')(app);
require('./routes/api-routes')(app);
require('./routes/auth-routes')(app);

//###########################################################       Database         ######################################################################
const databaseConfig = require("./database/config");
const databaseCredentials = require("./database/credentials");
const mongoose = require('mongoose');
const db = mongoose.connection;



mongoose.connect(
    `mongodb://${databaseCredentials.login}:${databaseCredentials.pwd}@${databaseConfig.url}/${databaseCredentials.authDatabase}`,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);

// //Tests
// const Test = require('./model/test-model');
// const newTest = new Test();
// newTest.name = '123';
// newTest.save();


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("we are connected to the database!");
});
//###########################################################     SANDBOX    ######################################################

//#############################

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);