
const express = require('express');
const app = express();
const db = require('../models');
const router = express.Router();
const axios = require('axios');
const layouts = require('express-ejs-layouts');


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));


router.post('/artists', function(req, res) {
  // TODO: Get form data and add a new record to DB
  // TODO: Get form data and add a new record to DB
  /*db.art.findOrCreate({
    where: {
    url: req.body.name,
    }
  }).then(() => {
    res.redirect('artists')
  })*/
});

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
            user.getArt()
            console.log(relationInfo)
          });
        });
  });
  res.render('favorites');
  });
});

router.get('/paintings', function(req, res){
  let randomNum = Math.floor(Math.random() * 10)
  console.log(randomNum)
  let wikiUrl = `https://www.wikiart.org/en/popular-paintings?json=1&page=${randomNum}`
  axios.get(wikiUrl).then( function(apiResponse) {
    res.render('paintings', {paintings: apiResponse.data});
  })
});

router.get('/paintings/:id', function(req, res) {
  axios.get(`https://www.wikiart.org/en/search/${req.query.title}/?json=2/`)
  .then((apiResponse) => {
    res.render('paintings', {paintings: apiResponse.data});
  })
});

router.post('/paintings', function(req, res){
  res.redirect("paintings");
});


router.post('/favorites', function(req, res) {
  console.log(req.user.id);
  db.user.findByPk(req.user.id).then(function([user, created]) {
    //console.log(user);
    db.art.findOrCreate({
      where: {
        url: req.body.name
      }
    });
  });
  res.redirect('/favorites');
});

router.get('/favorites', function(req, res){
  db.user.findByPk(req.user.id).then(function(user){
        user.getArts().then( function(arts){
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

module.exports = router;


/*router.get('/faves', async (req, res) => {
  let url = "https/www.wikiart.org/en/${art.url}/?json=2"
  let favourites = art.map(async artist => {
    return await axios.get(url).then(responseData);
  }
}
let favourites = artists.map( async artist => {
  return await axios.get(url).then(responseData => responseData)
})*/