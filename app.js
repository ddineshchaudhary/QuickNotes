var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var login = require('./routes/login');
var register = require('./routes/register');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//database connection
mongoose.connect(`${process.env.dbURL}`)
    .then(console.log('MongoDB Connected !'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/login',login);
app.use('/register', register);

module.exports = app;