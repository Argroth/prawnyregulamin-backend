const blogController = require('../controller/blog-controller');
const apiMiddleware = require('../middleware/validateapi-middleware');

module.exports = (app) => {
    app.get('/blog', blogController.getAllBlog);
    app.post('/blog/create', apiMiddleware.validateAPI, blogController.createBlog);
    app.post('/blog/delete', apiMiddleware.validateAPI, blogController.deleteBlog);
    app.post('/blog/edit', apiMiddleware.validateAPI, blogController.editBlog);
    app.post('/blog/post', blogController.getPostData);
}