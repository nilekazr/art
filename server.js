require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const methodOverride = require('method-override');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);


app.use(session ({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000
  }
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/', (req, res) => {
  let wikiUrl = `https://www.wikiart.org/en/app/api/popularartists?json=1`
  axios.get(wikiUrl).then((apiResponse) => {
    res.render('index', {artist: apiResponse.data});
  })
});

app.get('/', isLoggedIn, (req, res) => {
  res.render('/');
});

app.use('/', require('./routes/art'));
app.use('/auth', require('./routes/auth'));


var server = app.listen(process.env.PORT || 3000, () => console.log(`art. running on ${process.env.PORT || 3000}`));



module.exports = server;
