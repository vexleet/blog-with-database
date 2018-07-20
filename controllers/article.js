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
            Comments.findAll({
                include: [{
                    model: User
                }]
            }).then(current => {
                let comments = [];
                for (let i = 0; i < current.length; i++) {
                    if (current[i].articleId == id) {
                        comments.push(current[i]);
                    }
                }

                res.render('article/details', {
                    comments: comments,
                    title: article.title,
                    content: article.content,
                    userFullName: article.User.fullName,
                });
            });
        });
    },

    commentPost: (req, res) => {
        let getBody = req.body;
        let id = req.params.id;

        let errorMsg = '';

        if (!req.isAuthenticated()) {
            errorMsg = 'You are not logged in!';
        }

        if (errorMsg) {
            res.render('user/login', {
                'error': errorMsg,
            });
            return;
        }

        getBody.authorId = req.user.id;
        getBody.articleId = id;

        Comments.create(getBody).then(() => {
            res.redirect(`/article/details/${id}`);
        })
    },

};