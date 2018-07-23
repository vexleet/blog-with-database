const Article = require('../models').Article;
const User = require('../models').User;

module.exports = {
    index: (req, res) => {
        let args = req.body;
        let offsetNum = 0;

        if(args.articlesNumber >= 2){
            offsetNum = args.articlesNumber * 6 - 6;
        }

        let articlesLength = 0;

        Article.findAll().then(articles =>{
            articlesLength = articles.length;
        });

        Article.findAll({
            offset: offsetNum,
            limit: 6,
            include: [{
                model: User
            }]
        }).then(articles => {

            res.render('home/index', {
                articles: articles,
                n: Math.ceil(articlesLength / 6),
            });
        });
    }
};




