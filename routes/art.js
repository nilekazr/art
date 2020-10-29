
const express = require('express');
const app = express();
const db = require('../models');
const router = express.Router();
const axios = require('axios');
const layouts = require('express-ejs-layouts');


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));


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

router.get('/favorites', function(req, res){
  db.user.findByPk(req.user.id).then(function(user){
    user.getArts().then( function(arts){
      console.log(arts)
        let favourites = arts.map( art => {
          return axios.get(`https://www.wikiart.org/en/${art.url}/?json=2`)
            .then(responseData => responseData.data)
        })
        Promise.all(favourites).then(apiResponse => {
          console.log(apiResponse);
          res.render('favorites', {favourites: apiResponse})
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
          res.redirect('/favorites');
          });
        });
  });
  // res.redirect('/favorites');
});


router.get('/paintings', function(req, res){
  let randomNum = Math.floor(Math.random() * 10)
  console.log(randomNum)
  let wikiUrl = `https://www.wikiart.org/en/popular-paintings?json=1&page=${randomNum}`
  axios.get(wikiUrl).then( function(apiResponse) {
    res.render('paintings', {paintings: apiResponse.data});
  })
});



module.exports = router;