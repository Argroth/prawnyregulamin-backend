const Order = require('../model/order-model');
const axios = require('axios');
const request = require('request');
const crypto = require('crypto');
require('../emailer/emailer-config');

exports.getOrders = (req, res) => {
    Order.find({}, (err, orders) => {
        res.json(orders);
    })
}

exports.createOrder = async(req, res) => {
//21000 = 210zł

    const id = crypto.randomBytes(4).toString('hex');
    const date = new Date();

    const dateStr =
        ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
        ("00" + date.getDate()).slice(-2) + "/" +
        date.getFullYear() + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2);

    const token = axios({
        method: 'post',
        url: 'https://secure.payu.com/pl/standard/user/oauth/authorize',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `grant_type=client_credentials&client_id=${process.env.POS_CLIENT_ID}&client_secret=${process.env.POS_CLIENT_SECRET}`
    })
        .then(response => {return response});

    token.then((response) => {
        const Token = response.data.access_token;
        request({
                method: 'POST',
                url: 'https://secure.payu.com/api/v2_1/orders',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`
                },
                body: "{  \"notifyUrl\": \"https://api.prawnyregulamin.pl/order/notify\",  " +
                    "\"customerIp\": \"1.1.1.1\",  " +
                    `\"merchantPosId\": \"${process.env.POS_ID}\",  ` +
                    `\"description\": \"Pakiet: ${req.body.values.title} - ${req.body.values.firstName} ${req.body.values.lastName}\",  ` +
                    "\"currencyCode\": \"PLN\",  " +
                    `\"extOrderId\": \"${id}\",  ` +
                    `\"totalAmount\": \"${req.body.values.price * 100 * 1.23}\",  ` +
                    "\"products\": " +
                    "[    {      " +
                    `\"name\": \"${req.body.values.title}\",     ` +
                    ` \"unitPrice\": \"${req.body.values.price * 100 * 1.23}\",     ` +
                    " \"quantity\": \"1\"    } ]}"
            },
            function (error, response, body) {
                // console.log('Status:', response.statusCode);
                // console.log('Headers:', JSON.stringify(response.headers));
                // console.log(JSON.parse(body));


                //create new order
                const order = new Order;
                order.firstName = req.body.values.firstName;
                order.lastName = req.body.values.lastName;
                order.email = req.body.values.email;
                order.ourOrderId = id;
                order.orderCreateDate = dateStr;
                order.telephone = req.body.values.telephone;
                order.totalAmount = req.body.values.price * 100 * 1.23;
                order.order = req.body.values.title;
                order.customerDescription = req.body.values.description;
                order.orderId = JSON.parse(body).orderId;
                order.orderStatus = "Nowe";
                order.paymentStatus = "PENDING";
                order.save();

                //TODO send email
                const x = JSON.parse(body).redirectUri;

                const mailOptions = {
                    from: 'PrawnyRegulamin.pl - zamówienie <mail@prawnyregulamin.pl>', // sender address
                    to: `${req.body.values.email}`, // list of receivers
                    subject: "Zamówienie "+ id +" - Prawny Regulamin", // Subject line
                    html: `<html> 
                        <h2>Witaj! Dziękujemy za złożenie zamówienia  ${id}</h2>
                        <br/>
                            Jeżeli jeszcze tego nie zrobiłeś, możesz opłacić zamówienie pod adresem: <a href=`+ x +`>Zapłać teraz</a>
                        <br/>
                        <br/>
                            Zamówione dokumenty otrzymasz w osobnej wiadomości od jednego z naszych specjalistów najszybciej jak to możliwe.
                        <br/>
                        <br/>
                            Jeżeli masz jakieś pytania,  lub chcesz dostarczyć nam dodatkowe informacje proszę odpowiedzieć bezpośrednio na tą wiadomość.
                        <br/>
                        <br/>                        
                        <br/>
                        <br/>
                        <strong>POUCZENIE O ZASADACH PRZETWARZANIA DANYCH OSOBOWYCH</strong>
                        <br/>
                        <br/>
                            Informujemy, że w przypadku przetwarzania danych osobowych administratorem Państwa danych jest Prawnyregulamin.pl Nina Binder z siedzibą w Katowicach, 
                            ul. Wróbli 28/1. Dane będą przetwarzane w celu świadczenia usług i produktów oraz obsługi Klientów. Podanie danych osobowych wynika z obowiązku
                             prawnego, a w zakresie wynikającym ze zgody lub umowy jest dobrowolne, ale brak danych uniemożliwia świadczenie usług. Podstawą przetwarzania danych jest 
                             przepis prawa lub odpowiednio zawarta umowa na świadczenie usług oraz zgoda, jeśli została udzielona. Administrator informuje, że zgodnie z przepisami, osoba 
                             której dane osobowe będą przetwarzane ma prawo do: wglądu do swoich danych, ich poprawiania oraz wnioskowania o zmianę treści danych i ich usunięcie.
                            <br />
                        <br />
                            Treść tej wiadomości, wraz z ewentualnymi załącznikami, zawiera informacje przeznaczone tylko dla wymienionego w niej adresata i może zawierać 
                            informacje, które są poufne oraz prawnie chronione. Jeżeli nie są Państwo jej adresatem, bądź otrzymali ją przez pomyłkę należy: powiadomić niezwłocznie nadawcę 
                            poprzez odesłanie zwrotnej odpowiedzi na tę wiadomość, usunąć wiadomość w całości, nie ujawniać, nie rozpowszechniać, nie powielać i nie używać jej w jakikolwiek 
                            sposób w całości lub w części w jakiejkolwiek formie.
                        </html>
                        `
                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        res.json('Problem with e-mail sending');
                    } else {
                        console.log('Email sent');
                    }
                });
                res.json({redirectURL: JSON.parse(body).redirectUri});
            });

    })
};

exports.oderNotify = (req, res) => {
    Order.findOne({ourOrderId: req.body.order.extOrderId}, (err, orderFound) => {
        if(!orderFound){
            console.log("user not found");
            res.status(200);
        }else{
            if(orderFound.paymentStatus !== "COMPLETED"){
                console.log("changing status");
                orderFound.paymentStatus = req.body.order.status;
                orderFound.description = req.body.order.description;
                orderFound.save();
                res.status(200);
            }else{
                res.status(200);
            }
        }
    })
    res.status(200);
};

exports.closeOrder = (req, res) => {
    Order.findOne({_id: req.body.values._id}, (err, orderFound) => {
        if(err){
            res.status(202).json("Wystąpił problem z zamknięciem zamówienia");
        }else{
            orderFound.orderStatus = "Zrealizowane";
            orderFound.save();

            res.status(200).json("Zamknięto zamówienie");
        }
    })
};

