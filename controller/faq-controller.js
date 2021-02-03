const FAQ = require('../model/faq-model');

exports.getAllFaqs = (req, res) => {
    FAQ.find({}, (err, faqs) => {
        res.json(faqs);
    })
}

exports.createFaq = (req, res) => {
    const faq = new FAQ;
        faq.question = req.body.values.question;
        faq.answer = req.body.values.answer;

    faq.save((err) => {
        if(err){
            res.json('Wystąpił problem z pytania.' +err);
        }else{
            res.json('Dodano pytanie');
        }
    });
}

exports.updateFaq = (req, res) => {
    FAQ.findOne({_id: req.body.values._id}, (err, faqFound) => {

        faqFound.question = req.body.values.question;
        faqFound.answer = req.body.values.answer;

        faqFound.save((err) => {
            if(err){
                res.json('Wystąpił problem z edycją pytania' +err);
            }else{
                res.json('Pomyślnie edytowano');
            }
        });
    })
}

exports.deleteFaq = (req, res) => {
    FAQ.findOneAndDelete({_id: req.body.values._id}, (err) => {
        if(err){
            res.json('Wystąpił problem z usunięciem pytania');
        }else{
            res.json('Pytanie usunięte');
        }
    });
}