const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const User = require('../models/user.js');

// get route
router.get('/register', (req, res)=>{
  res.render('users/register.ejs');
});

// start session
router.post('/', (req, res)=>{
  User.findOne({ username: req.body.username}, (err, foundUser)=>{
      if(req.body.password == foundUser.password){
        req.session.currentUser = foundUser;
        res.redirect('/');
      } else {
          res.send('incorrect password')
      }
  });
});





// router.post('/register', (req, res) => {
//
//   // first we are going to hash the password
//   const password = req.body.password;
//   const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//
//   // lets create a object for our db entry;
//   const userDbEntry = {};
//   userDbEntry.username = req.body.username;
//   userDbEntry.password = passwordHash
//
//   // lets put the password into the database
//   User.create(userDbEntry, (err, user) => {
//     console.log(user)
//
//     // lets set up the session in here we can use the same code we created in the login
//     req.session.username = user.username;
//     req.session.logged   = true;
//     res.redirect('/articles')
//   });
//
// })

// end session
router.delete('/', (req, res)=>{
  req.session.destroy(()=>{
    res.redirect('/');
  });
});

module.exports = router;
