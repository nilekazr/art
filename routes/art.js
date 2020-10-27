
// requirements
const express = require('express');
const app = express();
const db = require('../models');
const router = express.Router();
const axios = require('axios');
const layouts = require('express-ejs-layouts');

// middleware
app.set('view engine', 'ejs');
// routes
router.get('/paintings', function(req, res){
    let wikiUrl = `https://www.wikiart.org/en/popular-paintings?json=1&page=1`
    axios.get(wikiUrl)
    .then( function(apiResponse) {
    console.log(apiResponse.data)
    res.render('paintings', {paintings: apiResponse.data});
    })
});

router.post('/paintings', function(req, res){
  res.redirect("paintings");
});

router.get('/artists', function(req,res){
  res.render('artists');
});

router.get('/favorites', function(req,res){
    res.render("favorites");
});


module.exports = router;
