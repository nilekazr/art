
// requirements
const express = require('express');
const app = express();
const router = express.Router();
const axios = require('axios');
const layouts = require('express-ejs-layouts');
const db = require('../models');

// middleware
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

// routes


router.get('/artists/', function(req,res){
  let artistInfoUrl = `https://www.wikiart.org/en/${req.query.name}/?json=2`
  let paintingInfoUrl = `https://www.wikiart.org/en/${req.query.name}/?json=1`
  Promise.all([
    axios.get(artistInfoUrl),
    axios.get(paintingInfoUrl)
  ]).then((apiResponse) => {
    res.render('artists', {
      artist: apiResponse[0].data,
      paintings: apiResponse[1].data
    });
  })
});

router.get('/favorites', async (req, res) => {
  db.user.findOne({
    where: {
      id: req.user.id
    }
    }).then(function(returnedUser){
        returnedUser.getArts().then(function(returnedArt){
          console.log(returnedArt)
          axios.get(`https://www.wikiart.org/en/${returnedArt.url}/1?json=2`)
        .then(function(apiResponse){
          res.render('favorites', {favorites: apiResponse.data});
            });
          });
        });
      });

router.post('/favorites', function(req, res) {
  console.log(req.user.id);
  db.user.findByPk(req.user.id)
    .then(function(user) {
      console.log(user);
      db.art.findOrCreate({
        where: {
          url: req.body.name
        }
      }).then(function([art, created]){
        user.addArt(art).then(function(relationInfo){
          // console.log(relationInfo)
          res.render('favorites');
        });
      })
    });
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
