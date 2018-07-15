const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    const Comments = sequelize.define('Comments', {
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
            required: true
        },
    }, {
        timestamps: false
    });

    Comments.associate = function (models) {
        Comments.belongsTo(models.User, {
            foreignKey: 'authorId',
            targetKey: 'id'
        });
        Comments.belongsTo(models.Article, {
            foreignKey: 'articleId',
            targetKey: 'id'
        });
    };



    return Comments;
};