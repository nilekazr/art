const express = require('express');
const db = require('../models')
const passport = require('../config/ppConfig')
const router = express.Router();

router.use(express.urlencoded({extended: false}));

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  // finding or creating user, given name, password, email
  db.user.findOrCreate({
    where: { email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) => {
    if (created) {
      // if created, this means success, we can redirect to home
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and user logged in!'
      })(req, res)
    } else {
      // if not created, email already exists
      req.flash('error', 'Email already exist!')
      res.redirect('/auth/login')
    }
  }).catch(error => {
    // if an error occurs, let's see error
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
  successFlash: 'Login successful!',
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You have logged out.')
  res.redirect('/')
})


module.exports = router;
