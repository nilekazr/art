const express = require('express');
const db = require('../models')
const passport = require('../config/ppConfig')
const router = express.Router();


router.use(express.urlencoded({extended: false}));


router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  db.user.findOrCreate({
    where: { email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) => {
    if (created) {
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created. Welcome to art.!'
      })(req, res)
    } else {
      req.flash('error', 'E-mail address already exists!')
      res.redirect('/auth/login')
    }
  }).catch(error => {
    req.flash('error', error.message)
    res.redirect('/auth/signup')
  })  
})

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username or password',
  successFlash: 'Welcome back to art.!',
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('goodbye', 'SEE YOU SPACE COWBOY')
  res.redirect('/')
})



module.exports = router;
