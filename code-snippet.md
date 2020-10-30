* Devin: delete function for favorites
```
  router.delete('/favorites/:id', (req, res) => {
  db.art.findOne({
    where: {
      url: req.params.id
    }
    }).then((foundArt) => {
      foundArt.destroy();
    })
  res.redirect('favorites')
  })
```

* Jeffrey: Nested forms in nested modals
```
  <button class="button small" data-open="loginSignupModal">Login / Signup</button>
    <div class="reveal" id="loginSignupModal" data-reveal>
  <button class="button secondary" data-open="signupModal">Sign Up!</button>
    <div class="reveal" id="signupModal" data-reveal>
```

* Nile:
```

```