* Devin: delete function for favorites
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

* Jeffrey:
