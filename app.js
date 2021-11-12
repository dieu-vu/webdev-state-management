'use strict';
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const username = 'foo';
const password = 'bar';

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
app.use(session({secret: 'foobar'}));
var sessionData;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/secret', (req, res) => {
	res.render('secret');
});

app.post('/login', (req, res, next) => {
	console.log(req.body);
	sessionData = req.session;
	sessionData.username = req.body.username;
	sessionData.password = req.body.password;
	if (sessionData.username === username && sessionData.password === password) {
		sessionData.logged = true;
		res.redirect('./secret');
	} else {
		console.log('wrong login');
		sessionData.logged = false;
		res.redirect('./form');
	};
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
