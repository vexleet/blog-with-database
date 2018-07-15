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
            required: true
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