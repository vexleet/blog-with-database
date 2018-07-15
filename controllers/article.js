const Article = require('../models').Article;
const User = require('../models').User;
const Comments = require('../models').Comments;
let counter = 0;

module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },

    createPost: (req, res) => {
        let articleArgs = req.body;

        let errorMsg = '';

        if (!req.isAuthenticated()) {
            errorMsg = 'You should be logged in to create articles!';
        }
        else if (!articleArgs.title) {
            errorMsg = 'Invalid title!';
        }
        else if (!articleArgs.content) {
            errorMsg = 'Invalid content!';
        }

        if (errorMsg) {
            res.render('article/create', {
                'error': errorMsg,
                'title': articleArgs.title,
                'content': articleArgs.content
            });
            return;
        }

        console.log(req.user);
        articleArgs.authorId = req.user.id;

        Article.create(articleArgs).then(article => {
            res.redirect('/');
        }).catch(err => {
            res.render('article/create', {'error': err.message});
        });
    },

    details: (req, res) => {
        let id = req.params.id;
        let saveArticle = {};

        Article.findById(id, {
            include: [{
                model: User
            }]
        }).then(article => {
            saveArticle = article;
        });


        Comments.findAll({
            include: [{
                model: User
            }]
        }).then(current => {
            let save = [];
            for (let i = 0; i < current.length; i++) {
                if (current[i].dataValues.articleId == id) {
                    save.push(current[i]);
                }
            }

            res.render('article/details', {
                comments: save,
                title: saveArticle.title,
                content: saveArticle.content,
                userFullName: saveArticle.User.fullName,
            });

        });

    },

    commentPost: (req, res) => {
        let getBody = req.body;

        getBody.authorId = req.user.id;
        getBody.articleId = req.params.id;

        Comments.create(getBody).then(comment => {
            res.redirect('/');
        })
    },
};