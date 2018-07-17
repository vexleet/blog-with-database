const Article = require('../models').Article;
const User = require('../models').User;

module.exports = {
    index: (req, res) => {
        let args = req.body;
        let offsetNum = 0;
        let counter = 0;

        if(args.articlesNumber){
            offsetNum = Number(args.articlesNumber);

            if(args.articlesNumberPrevious){
                offsetNum -= Number(args.articlesNumberPrevious);
                if(offsetNum < 0){
                    offsetNum = Number(args.articlesNumber);
                }
            }
            else if(args.articlesNumberNext){
                offsetNum += Number(args.articlesNumberNext);
            }
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
                pages: articlesLength
            });
        });
    }
};




