const Offer = require('../model/offer-model');
const Customer = require('../model/customer-model');
require('../emailer/emailer-config');


exports.index = (req, res) => {
    res.json('Hello world');
};

exports.getAllOffers = (req, res) => {
    Offer.find({}, (err, offers) => {
        res.json(offers);
    })
};

exports.createOffer = async(req, res) => {
    const offer = new Offer;

    offer.name = req.body.name;
    offer.lastName = req.body.lastName;
    offer.telephone = req.body.telephone;
    offer.email = req.body.email;
    offer.vatID = req.body.vatID;
    offer.description = req.body.description;


    await Customer.findOne({$or: [{email: req.body.email}, {telephone: req.body.telephone}]}, async(err, customerFound) => {
        if(!customerFound){
            const customer = new Customer;

            customer.name = req.body.name;
            customer.lastName = req.body.lastName;
            customer.telephone = req.body.telephone;
            customer.email = req.body.email;

            await customer.save();
        }
    });

        // let transporter = nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port: process.env.EMAIL_PORT,
        //     secure: false,
        //     tls: {
        //         rejectUnauthorized: false
        //     },
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PWD
        //     }
        // });

        const mailOptions = {
            from: 'mail@dot-dev.com', // sender address
            to: "basic15pl@gmail.com", // list of receivers
            subject: "Contact request", // Subject line
            text: `Hello`  // plain text body
        };

        await transporter.sendMail(mailOptions, (err) => {
            if(err){
                console.log('There was a problem sending email', err);
            } else {
                console.log('email sent')
            }
        });

    await offer.save((err) => {
        if(err){
            res.json('Wystąpił problem z wysłaniem zapytania ofertowego' +err)
        }else{
            res.json('Utworzono nowe zapytanie ofertowe')
        }
    });
};

exports.addAnswerfromOwner = (req, res) => {
    Offer.findOne({_id: req.body._id}, (err, offerFound) => {
        const date = new Date();
        const dateStr =
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);

        offerFound.answers.push({answer: req.body.answer, addedBy: "Owner", date: dateStr});
        offerFound.status = "odpowiedziana";

        offerFound.save((err) => {
            if(err){
                res.json('Wystąpił problem z dodaniem odpowiedzi' +err)
            }else{
                res.json('Dodano odpowiedź')
            }
        });
    })
};

exports.addAnswerfromCustomer = (req, res) => {
    Offer.findOne({_id: req.body._id}, (err, offerFound) => {
        const date = new Date();
        const dateStr =
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);

        offerFound.answers.push({answer: req.body.answer, addedBy: "Customer", date: dateStr});


        offerFound.save((err) => {
            if(err){
                res.json('Wystąpił problem z dodaniem odpowiedzi' +err)
            }else{
                res.json('Dodano odpowiedź')
            }
        });
    })
};

exports.markAsClosed = (req, res) => {
    Offer.findOne({_id: req.body._id}, (err, offerFound) => {
        offerFound.status = "completed";

        offerFound.save((err) => {
            if(err){
                res.json('Wystąpił błąd przy zamykaniu zapytania ofertowego' +err)
            }else{
                res.json('Zapytanie ofertowe oznaczone jako zakończone')
            }
        });
    })
};