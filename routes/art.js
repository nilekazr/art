
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
app.get('/paintings', function(req, res){
    const painting = axios.get()
    res.render('paintings');
});

app.post('/paintings', function(req, res){
    res.redirect("paintings");
});

app.get('/artists', function(req,res){
    res.render('artists');
});

app.get('/favorites', function(req,res){
    res.render("favorites");
});


module.exports = router;
