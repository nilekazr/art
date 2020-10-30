const express = require('express');
const app = express();
const db = require('../models');
const router = express.Router();
const axios = require('axios');
const layouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const { request } = require('express');


app.set('view engine', 'ejs');


app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: false}));


router.get('/artists/', (req,res) => {
  let artistInfoUrl = `https://www.wikiart.org/en/${req.query.name}/?json=2`
  let paintingInfoUrl = `https://www.wikiart.org/en/${req.query.name}/?json=1`
  Promise.all([
    axios.get(artistInfoUrl),
    axios.get(paintingInfoUrl)
  ]).then((apiResponse) => {
    res.render('artists', {
      artist: apiResponse[0].data,
      paintings: apiResponse[1].data
    })
  })
});

router.get('/paintings', (req, res) => {
  let randomNum = Math.floor(Math.random() * 10)
  let wikiUrl = `https://www.wikiart.org/en/popular-paintings?json=1&page=${randomNum}`
  axios.get(wikiUrl).then((apiResponse) => {
    res.render('paintings', {paintings: apiResponse.data});
  })
});

router.get('/favorites/', (req, res) => {
  db.user.findByPk(req.user.id).then((user) => {
    user.getArts().then((arts) => {
        let favorites = arts.map( art => {
          return axios.get(`https://www.wikiart.org/en/${art.url}/?json=2`)
            .then(responseData => responseData.data)
        })
        Promise.all(favorites).then(apiResponse => {
          res.render('favorites', {favorites: apiResponse})
      })
    })
  })
});

router.post('/favorites', (req, res) => {
  db.user.findByPk(req.user.id)
    .then((user) => {
      db.art.findOrCreate({
        where: {
          url: req.body.name
        }
      }).then(([foundArt, created]) => {
        user.addArt(foundArt).then((relationInfo) => {
        res.redirect('/favorites');
        })
      })
    })
});

router.delete('/favorites/:id', (req, res) => {
let id = req.params.id
db.art.findOne({
  where: {
    url: id
  }
  }).then((foundArt) => {
    foundArt.destroy();
  })
res.redirect('/favorites')
})


module.exports = router;