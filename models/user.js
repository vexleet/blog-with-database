const Sequelize = require('sequelize');
const encryption = require("../utilities/encryption");

module.exports = function (sequelize) {
    const User = sequelize.define('User', {
        email: {
            type: Sequelize.STRING,
            required: true,
            unique: true,
            allowNull: false
        },
        passwordHash: {
            type: Sequelize.STRING,
            required: true
        },
        fullName: {
            type: Sequelize.STRING,
            required: true,
            unique: true,
        },
        birthDate: {
            type: Sequelize.STRING,
            allowNull: false,
            required: true,
        },
        salt: {
            type: Sequelize.STRING,
            required: true
        },
        gender: {
            type: Sequelize.STRING,
            required: true
        },
        likedArticles: {
            type: Sequelize.STRING,
            required: true,
            allowNull: true,
            get() {
                if(this.getDataValue('likedArticles') == null){
                    return [];
                }

                return this.getDataValue('likedArticles').split(',');
            },
            set(val) {

                if(this.likedArticles.length > 0){
                    if(this.likedArticles.includes(val.toString())){
                        let indexOfVal = this.likedArticles.indexOf(val.toString());
                        let arr = this.likedArticles;
                        arr.splice(indexOfVal, 1);
                        return this.setDataValue('likedArticles', arr.join(','));
                    }
                    let current = [this.likedArticles, val];
                    this.setDataValue('likedArticles', current.join(','));
                    return;
                }

                this.setDataValue('likedArticles',val.join(','));
            },
        }
    });

    User.prototype.authenticate = function (password) {
        let inputPasswordHash = encryption.hashPassword(password, this.salt);
        return inputPasswordHash === this.passwordHash;
    };

    User.associate = (models) => {
        User.hasMany(models.Article, {
            foreignKey: 'authorId',
            targetKey: 'id'
        });
    };

    return User;


};