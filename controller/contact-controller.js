const Question = require('../model/contact-model');
const Customer = require('../model/customer-model');
require('../emailer/emailer-config');

exports.getAllQuestions = (req, res) => {
    Question.find({}, (err, questions) => {
        res.json(questions);
    })
};

exports.createQuestion = async(req, res) => {
    const form = req.body.values;

    const question = new Question;
    question.name = form.name;
    question.lastName = form.lastName;
    question.email = form.email;
    question.telephone = form.telephone;
    question.question = form.message;

    await Customer.findOne({$or: [{email: form.email}, {telephone: form.telephone}]}, async(err, customerFound) => {
        if(!customerFound){
            const customer = new Customer;

            customer.name = form.name;
            customer.lastName = form.lastName;
            customer.telephone = form.telephone;
            customer.email = form.email;
            customer.customer = "potencjalny";

            await customer.save();
        }
    });

    await question.save(async (err) => {
        if(err){
            res.json('Wystąpił problem z wysłaniem pytania' +err)
        }else{
            const mailOptions = {
                from: 'PrawnyRegulamin.pl - kontakt <mail@prawnyregulamin.pl>', // sender address
                to: `${form.email}`, // list of receivers
                subject: "Kontakt - Dostarczenie pytania", // Subject line
                html: `<html> 
                        <h2>Twoje pytanie zostało dostarczone do Naszego systemu - Dziękujemy.</h2> 
                        <br/>
                        <br/>
                        Nasz prawnik przygotuje dla Ciebie odpowiedź w możliwie najkrótszym czasie.
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

            await transporter.sendMail(mailOptions, (err) => {
                if(err){
                    console.log('There was a problem sending email', err);
                } else {
                    console.log('email sent')
                }
            });

            res.json('Pytanie utworzone')
        }
    });
};

exports.answerQuestion = (req, res) => {
    Question.findOne({_id: req.body.values._id}, (err, questionFound) => {
        questionFound.answer = req.body.values.answer;
        questionFound.status = "odpowiedziane";

        questionFound.save((err) => {
            if(err){
                res.json('Wystąpił problem z zapisaniem odpowiedzi na pytanie' +err)
            }else{

                const mailOptions = {
                    from: 'PrawnyRegulamin.pl - odpowiedź <mail@prawnyregulamin.pl>', // sender address
                    to: `${questionFound.email}`, // list of receivers
                    subject: "Kontakt - Nowa odpowiedź", // Subject line
                    html: `
                        <html> 
                        <h2>Nasz Prawnik przygotował i zamieścił odpowiedź na Twoje zapytanie.</h2>
                        <br/>
                        Jeszcze raz dziękujemy za zainteresowanie i kontakt!
                        <br/>
                        <br/>
                        <h3>Odpowiedź: </h3>
                        ${req.body.values.answer}
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
                    if(err){
                        console.log('There was a problem sending email', err);
                    } else {
                        console.log('email sent')
                    }
                });


                res.json('Odpowiedź dodana')
            }
        });
    })
};