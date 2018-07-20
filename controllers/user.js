const encryption = require("../utilities/encryption");
const User = require('../models').User;

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let registerArgs = req.body;

        User.findOne({where: {email: registerArgs.email}}).then(user => {
            let errorMsg = '';
            if (user) {
                errorMsg = 'User with the same username exists!';
            } else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Passwords do not match!'
            }
            else if(!registerArgs.birthDate){
                errorMsg = 'Please enter your birth date!';
            }

            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register',{
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
    editPost: (req, res) =>{
        let args = req.body;
        let userId = req.params.id;

        User.findOne({where: {id: userId}}).then(user => {
            user.update(args)
                .then(() => {
                    res.redirect(`/${user.fullName}/details`);
                });
        });
    },

    passwordGet: (req, res) => {
        res.render('user/password');
    },

    passwordPost: (req, res) => {
        let args = req.body;
        let userId = req.params.id;

        User.findOne({where: {id: userId}}).then(user => {
            if(args.password === args.repeatedPassword){
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(args.password, salt);

                user.update({
                    passwordHash: passwordHash,
                    salt: salt,
                }).then(() => {
                    res.redirect(`/${user.fullName}/details`);
                })
            }
        });
    }
};