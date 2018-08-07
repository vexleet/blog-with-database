const userController = require('../controllers').user;
const homeController = require('../controllers').home;
const articleController = require('../controllers').article;

module.exports = (app) =>{
    app.get('/',homeController.index);
    app.post('/', homeController.index);


    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login',userController.loginGet);
    app.post('/user/login',userController.loginPost);

    app.get('/account', userController.detailsGet);
    app.get('/:fullName/details', userController.detailsGetUser);

    app.get('/:fullName/edit/:id', userController.editGet);
    app.post('/:fullName/edit/:id', userController.editPost);

    app.get('/user/articles/:id', userController.articlesGet);
    app.get('/user/article/edit/:id', userController.editArticleGet);
    app.post('/user/article/edit/:id', userController.editArticlePost);
    app.get('/user/article/delete/:id', userController.deleteGet);
    app.post('/user/article/delete/:id', userController.deletePost);

    app.get('/:fullName/changePassword/:id', userController.passwordGet);
    app.post('/:fullName/changePassword/:id', userController.passwordPost);

    app.get('/user/logout',userController.logout);

    app.get('/article/create', articleController.createGet);
    app.post('/article/create', articleController.createPost);

    app.get('/article/details/:id', articleController.details);
    app.post('/article/details/:id', articleController.commentPost);
};
