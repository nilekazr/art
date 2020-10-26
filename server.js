require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

app.use(session ({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(flash())

app.use((req, res, next) => {
  // before every route, attach flash messages and current user to res.locals
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/', (req, res) => {
  let artistUrl = 'pablo-picasso'
  let wikiUrl = `https://www.wikiart.org/en/${artistUrl}/?json=2`
  axios.get(wikiUrl).then( function(apiResponse) {
    console.log(apiResponse.data)
    res.render('index', {artist: apiResponse.data});
  })
});

// the following two lines must be below config of session
app.use(passport.initialize())
app.use(passport.session())

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.use('/art', require('./routes/art'));

var server = app.listen(process.env.PORT || 3000, ()=> console.log(`art. running on ${process.env.PORT || 3000}`));

module.exports = server;
