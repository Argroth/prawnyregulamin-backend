const Customer = require('../model/customer-model');

exports.getAllCustomers = (req, res) => {
    Customer.find({}, (err, customers) => {
        res.json(customers);
    })
};

exports.createCustomer = (req, res) => {
    const customer = new Customer;
    customer.name = req.body.values.name;
    customer.lastName = req.body.values.lastName;
    customer.telephone = req.body.values.telephone;
    customer.email = req.body.values.email;

    customer.save((err) => {
        if(err){
            res.status(202).json('Wystąpił błąd przy tworzeniu klienta' +err)
        }else{
            res.status(200).json('Klient utworzony')
        }
    });
};

exports.deleteCustomer = (req, res) => {
    Customer.findOne({_id: req.body.values}, (err, customerFound) => {
        customerFound.status = "nieaktywny";

        customerFound.save((err) => {
            if(err){
                res.status(202).json('Wystąpił błąd przy usuwaniu klienta' +err)
            }else{
                res.status(200).json('Klient usunięty')
            }
        });
    })
};

exports.updateCustomer = (req, res) => {
    Customer.findOne({_id: req.body.values._id}, (err, customerFound) => {
        customerFound.name = req.body.values.name;
        customerFound.lastName = req.body.values.lastName;
        customerFound.telephone = req.body.values.telephone;
        customerFound.email = req.body.values.email;

        customerFound.save((err) => {
            if(err){
                res.status(202).json('Wystąpił błąd przy aktualizacji klienta' +err)
            }else{
                res.status(200).json('Klient edytowany')
            }
        });
    })
}


