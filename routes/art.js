
// requirements
const express = require('express');
const app = express();
const router = express.Router();
const axios = require('axios');
const layouts = require('express-ejs-layouts');
const db = require('../models');

// middleware
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

// routes

router.post('/artists', function(req, res) {
  // TODO: Get form data and add a new record to DB
  // console.log(req.body.name)
  db.art.findOrCreate({
    where: {
    url: req.body.name,
    }
  }).then(() => {
    res.redirect('artists')
  })
});

router.get('/artists/', function(req,res){
  console.log(req.query.url)
  let wikiUrl = `https://www.wikiart.org/en/${req.query.name}/?json=2`
  axios.get(wikiUrl).then((apiResponse) => {
    res.render('artists', {artist: apiResponse.data});
  })
});

router.get('/paintings', function(req, res){
  let randomNum = Math.floor(Math.random() * 10)
  let wikiUrl = `https://www.wikiart.org/en/popular-paintings?json=1&page=${randomNum}`
  axios.get(wikiUrl).then( function(apiResponse) {
    res.render('paintings', {paintings: apiResponse.data});
  })
});

router.get('/paintings/:id', function(req, res) {
  axios.get(`https://www.wikiart.org/en/search/${req.query.title}/1?json=2/`)
  .then((apiResponse) => {
    res.render('paintings', {paintings: apiResponse.data});
  })
});

router.post('/paintings', function(req, res){
  res.redirect("paintings");
});


router.get('/favorites', function(req,res){
    res.render("favorites");
});


module.exports = router;
