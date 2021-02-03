const Blog = require('../model/blog-model');

exports.index = (req, res) => {
    res.json('Hello world');
};

exports.getAllBlog = (req, res) => {
    Blog.find({}, (err, blogFound) => {
        res.json(blogFound);
    })
}

exports.getPostData = (req, res) => {
    console.log(req.body.values);
    Blog.find({link: req.body.values}, (err, blogFound) => {
        console.log(blogFound);
        res.json(blogFound);
    })
}

exports.createBlog = (req, res) => {
    const blog = new Blog();

    blog.title = req.body.newValues.title;
    blog.link = req.body.newValues.title.replace(/\s+/g, '-').split('.').join("").split(',').join("").toLowerCase();
    blog.shortDesc = req.body.newValues.shortDesc;
    blog.content = req.body.newValues.content;

    blog.save((err) => {
        if(err){
            res.status(202).json('Wystąpił błąd przy tworzeniu Posta' +err);
        }else{
            res.status(200).json('Post na Blogu utworzony');
        }
    });
};

exports.deleteBlog = (req, res) => {
    Blog.findOneAndDelete({_id: req.body.values._id}, (err) => {

        if(err){
            res.status(202).json('Wystąpił problem z posta na blogu');
        }else{
            res.status(200).json('Post usunięty');
        }

    });
}

exports.editBlog = (req, res) => {
    Blog.findOne({_id: req.body.newValues._id}, (err, Post) => {
        if(err){
            res.status(202).json('Nie znaleziono posta');
        }else{
            Post.title = req.body.newValues.title;
            Post.content = req.body.newValues.content;
            Post.shortDesc = req.body.newValues.shortDesc;

            Post.save((err) => {
                if(err){
                    res.status(202).json('Wystąpił błąd przy edycji Posta');
                }else{
                    res.status(200).json('Post edytowany');
                }
            });
        }
    });
}