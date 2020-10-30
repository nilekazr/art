* Devin: delete function for favorites
```
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
```

* Jeffrey: Nested forms in nested modals
```
  <button class="button small" data-open="loginSignupModal">Login / Signup</button>
    <div class="reveal" id="loginSignupModal" data-reveal>
  <button class="button secondary" data-open="signupModal">Sign Up!</button>
    <div class="reveal" id="signupModal" data-reveal>
```

* Nile: Posting favorites to the database
```
  router.post('/favorites', function(req, res) {
    db.user.findByPk(req.user.id)
    .then(function(user) {
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
```