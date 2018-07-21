const encryption = require("../utilities/encryption");
const User = require('../models').User;
const Article = require('../models').Article;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let registerArgs = req.body;

        User.findOne({
            where: {
                [Op.or]: [{fullName: registerArgs.fullName}, {email: registerArgs.email}]
            }
        }).then(user => {
            let errorMsg = '';

            if (user) {
                errorMsg = 'This user already exists!';
            }
            else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Passwords do not match!'
            }
            else if (!registerArgs.birthDate) {
                errorMsg = 'Please enter your birth date!';
            }

            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register', {
                    'error': registerArgs.error,
                });
            } else {

                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);

                let userObject = {
                    email: registerArgs.email,
                    passwordHash: passwordHash,
                    fullName: registerArgs.fullName,
                    salt: salt,
                    birthDate: registerArgs.birthDate,
                    gender: registerArgs.gender
                };

                User.create(userObject).then(user => {
                    req.logIn(user, (err) => {
                        if (err) {
                            registerArgs.error = err.message;
                            res.render('user/register', registerArgs.dataValues);
                            return;
                        }
                        res.redirect('/')
                    })
                })
            }
        })
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;
        User.findOne({where: {email: loginArgs.email}}).then(user => {
            if (!user || !user.authenticate(loginArgs.password)) {
                loginArgs.error = 'Either username or password is invalid!';
                res.render('user/login', {
                    'error': loginArgs.error
                });
                return;
            }

            req.logIn(user, (err) => {
                if (err) {
                    res.redirect('/user/login', {error: err.message});
                    return;
                }

                res.redirect('/');
            })
        })
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    },

    detailsGet: (req, res) => {
        res.render(`user/details`);
    },

    editGet: (req, res) => {
        res.render('user/edit');
    },
    editPost: (req, res) => {
        let args = req.body;
        let userId = req.params.id;

        User.findOne({where: {id: userId}}).then(user => {
            if (user.authenticate(args.password)) {
                user.update({
                    fullName: args.fullName,
                    email: args.email,
                    birthDate: args.birthDate,
                    gender: args.gender,
                })
                    .then(() => {
                        res.redirect(`/${user.fullName}/details`);
                    })
                    .catch(() => {
                        res.render(`user/edit`, {
                            error: 'This user already exists!'
                        });
                    });
            }
            else {
                res.render(`user/edit`, {
                    error: 'Password does not match!'
                });
            }

        });
    },

    passwordGet: (req, res) => {
        res.render('user/password');
    },

    passwordPost: (req, res) => {
        let args = req.body;
        let userId = req.params.id;

        User.findOne({where: {id: userId}}).then(user => {
            if (args.newPassword === args.repeatedPassword && user.authenticate(args.oldPassword)) {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(args.newPassword, salt);

                user.update({
                    passwordHash: passwordHash,
                    salt: salt,
                }).then(() => {
                    res.redirect(`/${user.fullName}/details`);
                })
            }
            else if (args.newPassword === args.repeatedPassword && !user.authenticate(args.oldPassword)) {
                res.render(`user/password`, {
                    error: 'Old password must match the first password!'
                });
            }
            else {
                res.render(`user/password`, {
                    error: 'Passwords do not match!'
                });
            }
        });
    },

    articlesGet: (req, res) => {
        let userId = req.params.id;

        Article.findAll({where: {authorId: userId}})
            .then(article => {
                res.render('user/articles', {articles: article});
            })
    },

    deleteGet: (req, res) => {
        res.render('user/deleteArticle.hbs');
    },

    deletePost: (req, res) => {
        let artId = req.params.id;

        Article.findById(artId)
            .then(article => {
                let userId = article.authorId;
                article.destroy({force: true});
                res.redirect(`/user/articles/${userId}`)
            })
    },

    editArticleGet: (req, res) => {
        let artId = req.params.id;

        Article.findById(artId)
            .then(article => {
                res.render('user/editArticle', {
                    title: article.title,
                    content: article.content
                });
            });
    },

    editArticlePost: (req, res) => {
        let articleId = req.params.id;
        let args = req.body;

        Article.findById(articleId)
            .then(article => {
                let userId = article.authorId;

                article.update({
                    title: args.title,
                    'content': args.content
                });
                res.redirect(`/`)
            });
    },
};