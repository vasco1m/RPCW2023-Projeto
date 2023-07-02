var express = require('express');
var router = express.Router();
var passport = require('passport')
var userModel = require('../models/user')

/* GET users listing. */
router. get ('/', function (req, res, next) {
    res.send('respond with a resource');
});

router. get ('/login', function (req, res) {
    var data = new Date().toISOString().substring(0, 16)
    res.render('login', {
        d: data
    })
})

router. get ('/logout', function (req, res) {
  req.logout(function(err) {
    if (err) 
      res.render('error', {error: err})
    else
      res.redirect('/');
  })
})

router.post('/login', passport.authenticate('local'),
function (req, res) {
    res.redirect('/protegida')
})

router.get('/register', function(req,res){
  var data = new Date().toISOString().substring(0, 16)
  res.render('register', {d: data})
})

router.post('/register', passport.authenticate('local'), function(req,res){
  var data = new Date().toISOString().substring(0, 16)
  userModel.register(new userModel({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,
    level: req.body.level,
    active: true,
    dateCreated: data
  }),
    req.body.password,
    function(err, account){
      if(err)
        res.render('error', {error: err})
      else
        res.redirect('/')
    })
})

module.exports = router;