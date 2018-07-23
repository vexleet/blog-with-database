# Blog with database
This is my first "Big" project.
Simple blog in which you can create users, articles, write comments and etc.

## Getting Started
The instructions below will get you a copy of the project up and running 
on your local machine for development and testing purposes. 

### Prerequisites
You have to install MySQL or XAMPP, HeidiSQL and NodeJS. 
Read the articles below to help you install them.

- MySQL -> https://dev.mysql.com/doc/refman/8.0/en/windows-installation.html
- XAMPP -> https://www.wikihow.com/Install-XAMPP-for-Windows
- HeidiSQL -> https://support.hypernode.com/knowledgebase/use-heidisql/
- NodeJS -> http://blog.teamtreehouse.com/install-node-js-npm-windows

### Installing
All you have to do is go to the main folder of the project and open the console.
After that you have to write 

```
npm install
```

and wait the dependencies to get downloaded and you are done.

When you finish with installing the dependencies or while you are waiting you have to create a database in HeidiSQL (don't forget to turn on MySQL) with the name "blog" (no other name).

#### If you want different database name
In the project folder /config/config.js you have to write the name of the database you want in the "database" key.

### Starting the server
Starting the server is very simple. You have to go to the /bin folder and after that open one more console.
All you have to write is: 
```
node www
```
and after that it will tell you on which port it is listening on (don't close the console because you will shutdown the server and the page won't open).

### Possible errors
- If you receive something like this:
```
Unable to connect to the database!
```
You either didn't start your MySQL or you didn't create a database in HeidiSQL with the name "blog"

- If you can't connect to HeidiSQL it's because you have probably installed MySQL and you wrote some 
password while installing it. You have to write your password in the "Password" field in HeidiSQL 
when you want to run it and in the project folder /config/config.js you have to write your password in the "password" key too.

### Installing helper for handlebars for pagination
- If you want pagination
When you install the dependencies go to \node_modules\handlebars\dist\cjs\handlebars\helpers and after the helperMissing function write

```javascript
instance.registerHelper('times', function(n, block) {
var accum = '';
for(var i = 1; i <= n; ++i)
accum += block.fn(i);
return accum;
});
```

This piece of code will add a bonus function/helper for handlebars and this will display a pagination and 
with that you can display the other articles from the database not only the first six (otherwise you will get an error if you don't do that). 
If the pagination goes away just refresh the page till it shows up again. I'm not sure why this is happening but it will be fixed.
	
- If you don't want pagination
In /views/home/index.hbs delete this piece of code (it's at the bottom), otherwise you will get errors:
	
```html
{{#if articles}}
<form method="post">
<div class="btn-group" role="toolbar">
{{#times n}}
<button class="btn btn-primary" type="submit" value="{{this}}" name="articlesNumber">{{this}}</button>
{{/times}}
</div>
</form>
{{/if}}
```
	
After that delete everything from /controllers/home.js and Copy/Paste this code there:
```javascript
const Article = require('../models').Article;
const User = require('../models').User;

module.exports = {
index: (req, res) => {
let args = req.body;

Article.findAll({
limit: 6,
include: [{
model: User
}]
}).then(articles => {
res.render('home/index', {
articles: articles,
});
});
}
};
```

### Built With
- [NodeJS](https://nodejs.org/en/) - Server
- [ExpressJS](https://expressjs.com) - The web framework used
- [Handlebars](https://handlebarsjs.com) - Template
- [Sequelize](http://docs.sequelizejs.com) - Creating CRUD around [MySQL](https://www.mysql.com) entities
