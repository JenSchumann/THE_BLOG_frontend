const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Article = require('../models/articles.js');
const Author = require('../models/authors.js');
const bcrypt = require('bcryptjs');


//user login
router.get('/login', (req, res, next) =>{
  res.render('users/login.ejs', {message: req.session.message || ''});
});

//to register a user account
router.get('/register', (req, res, next) =>{
  res.render('users/register.ejs', {});
});

//if username & password are authenticated, user is routed to authors route
router.post('/login', (req, res, next) =>{
  User.findOne({ username: req.body.username }, (err, user) =>{
    if(user) {
            //compare hash w/password supplied for authenticating user
            if( bcrypt.compareSync(req.body.password, user.password) ){
                req.session.message = '';
                req.session.username = req.body.username;
                req.session.logged = true;
                console.log(req.session, req.body);

                res.redirect('/authors');
            } else {
              console.log('else condition in bcrypt comparison');
              req.session.message = 'Incorrect Username or Password';
              res.redirect('/users/login');
            }

    } else {

            req.session.message = 'Incorrect Username or Password';
            res.redirect('/login');
    }

  });
});

//user create as object for db upon registration
router.post('/register', (req, res, next) =>{

    //hash password upon creation to be saved to db
    const password = req.body.password;
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    //userword and hashed password instantiated as object for db
    const userDbEntry = {};
    userDbEntry.username = req.body.username;
    userDbEntry.password = passwordHash;

    User.create(userDbEntry, (err, user) =>{
      console.log(user);

    //session setup per validated login
    req.session.username = user.username;
    req.session.logged = true;
    res.redirect('/authors');
  });
});

//logout user session & redirect to home page
router.get('/logout', function(req, res){
  req.session.destroy(function(err){
    res.redirect('/');
  });
});

//end session
// router.delete('/', (req, res)=>{
//   req.session.destroy(function(){
//     res.redirect('/');
//   });
// })




//export controllers
module.exports = router;
