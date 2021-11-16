'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const passport = require('./utils/pass');
const port = 3000;
const username = 'foo';
const password = 'bar';

const loggedIn = (req, res, next) => {
	if(req.user) {
		next();
	} else {
		res.redirect('/form');
	}
};


var cors = require('cors');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
app.use(session({secret: 'foobar', cookie: {maxAge: 60000}}));
var sessionData;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Session has to be active before we use the passport
app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/setCookie/:clr', (req, res) => {
	res.cookie('color', req.params.clr).send(`cookie set ${req.params.clr}`);
});

app.get('/getCookie', (req, res) => {
	res.send(req.cookies);
});

app.get('/deleteCookie', (req, res) => {
	res.clearCookie('color').send('cookie cleared');
});

app.get('/form', (req,res) => {
	res.render('form');
});

app.get('/secret',loggedIn, (req, res) => {
	res.render('secret');
});

app.post('/login', 
	passport.authenticate('local', {failureRedirect: './form'}),
	(req, res) => {
		console.log('success');
		res.redirect('./secret');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
