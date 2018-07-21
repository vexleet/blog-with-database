# Blog with database
Simple blog in which you can create users, articles, write comments and etc.

## Getting Started
These instructions will get you a copy of the project up and running 
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

### Starting the server
To start the server is very simple. You have to go to the /bin folder and after that open one more console.
All you have to write is
```
node www
```
and after that it will tell you on which port it is listening on (don't close the console).

### Possible errors
- If you receive something like this:
````
Unable to connect to the database!
```
You either didn't start your MySQL or you didn't create a database in HeidiSQL with the name "blog"

- If you can't connect to HeidiSQL it's because you have probably installed MySQL and you wrote some 
password while installing it. All you have to do is  write your password in the "Password" field in HeidiSQL 
when you want to run it.

### Built With
- [NodeJS](https://expressjs.com) - The web framework used
- [Handlebars](https://handlebarsjs.com) - Template
- [Sequelize](http://docs.sequelizejs.com) - Creating CRUD around [MySQL](https://www.mysql.com) entities
