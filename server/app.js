const express = require('express');
const app = express();
const db = require('./config/db');

//create a cors middleware
app.use(function(req, res, next) {
    //set headers to allow cross origin request.
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
});

var UserController = require('./controllers/UserController');
app.use('/users', UserController);
 
var AuthController = require('./controllers/AuthController');
app.use('/auth', AuthController);

var PfeController = require('./controllers/PfeController');
app.use('/pfe',PfeController);
 
 
var anneeUni = require('./controllers/AnneeUniController');
app.use('/anneeUni',anneeUni);
 

module.exports = app;
