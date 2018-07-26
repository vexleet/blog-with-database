const Article = require('../models').Article;
const User = require('../models').User;
const Comments = require('../models').Comments;

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

        Article.create(articleArgs).then(() => {
            res.redirect('/');
        }).catch(err => {
            res.render('article/create', {'error': err.message});
        });
    },

    details: (req, res) => {
        let id = req.params.id;

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
                    likes: article.likes,
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
        else if (getBody.content === "") {
            errorMsg = "You have to comment something";
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
                        likes: article.likes,
                        userFullName: article.User.fullName,
                        error: errorMsg,
                    });
                });
            });
            return;
        }
        else if (Object.keys(getBody).length === 0) {
            Article.findById(id)
                .then(article => {
                    let currentLikes = article.likes;
                    let userId = req.user.id;

                    User.findById(userId)
                        .then(user => {

                            if (user.likedArticles.includes(article.id.toString())) {
                                currentLikes -= 1;
                            }
                            else {
                                currentLikes += 1;
                            }
                            user.update({
                                likedArticles: [article.id],
                            });

                            if(currentLikes < 0){
                                currentLikes = 0;
                            }

                            article.update({
                                likes: currentLikes,
                            })
                                .then(() => {
                                    res.redirect(`/article/details/${id}`);
                                });
                        });

                });

            return;
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