const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.js');
const Article = require('../models/articles.js');
const router = express.Router();

//  GET ROUTE
// index page
router.get('/', (req, res)=>{
  console.log(req.session, "this is req.session in the route /user");
	if(req.session.logged){
      User.find({}, (err, foundUsers)=>{
          res.render('./users/index.ejs', {
              users: foundUsers,
              currentUser: req.session.currentUser
          });
        });
  } else {
    res.redirect('/users/login')
  }
});

// NEW user page
router.get('/new', (req, res)=>{
  if(!req.session.currentUser) {
      return res.render('users/new.ejs');
    } else {
      return res.send('User account unavailable.  Create new one.');
  }
});

// EDIT page
router.get('/:id/edit', (req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{
    if(req.session.currentUser.username === foundUser.username){
      return res.render('users/edit.ejs', {
        user: foundUser,
        currentUser: req.session.currentUser
      });
    } else {
        return res.send('Members can only edit their own account.  If you are having trouble editing your account; logout, and try again.');
    }
  });
});

// SHOW page
router.get('/:id', (req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{
    console.log(foundUser);
    Article.findById({'article._id':req.params.id}, (err, foundArticle)=>{
      res.render('users/show.ejs', {
          user: foundUser,
          articles: foundArticle,
          currentUser: req.session.currentUser
      });
    });
  });
});

//  EDIT user
router.put('/:id', (req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser)=>{
      res.redirect('/users/' + req.params.id);
    });
  });
});

//  CREATE user
router.post('/register', (req, res)=>{
  // if(req.body.password !==""){
  //  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  // }
      // User.create(req.body, (err, createdUser)=>{
      //   res.render('users/show.ejs', {
        // res.redirect('/sessions/new');
//         user: createdUser
//         });
//     });
// });
// first we are going to hash the password
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  // lets create a object for our db entry;
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.password = passwordHash

  // lets put the password into the database
  User.create(userDbEntry, (err, user) => {
    console.log(user)

    // lets set up the session in here we can use the same code we created in the login
    req.session.username = user.username;
    req.session.logged   = true;
    res.redirect('/articles')
  });

});

router.post('/login', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {

    if(user){
      //now compare hash with the password from the form
      if(bcrypt.compareSync(req.body.password, user.password)){
        req.session.message  = '';
        req.session.username = req.body.username;
        req.session.logged   = true;
        // console.log(req.session, req.body)

        res.redirect('/users')
      } else {
        console.log('else in bcrypt compare')
        req.session.message = 'Username or password are incorrect';
        res.redirect('/users/login')

      }

    } else {

      req.session.message = 'Username or password are incorrect';
      res.redirect('/users/login')

    } //end of if user
  });

});

// seed data route to seed.js file  //need to refactor as user//
// router.get('/seed', (req, res)=>{
//   Author.insertMany(authorSeed, (err, authors) =>{
//     if(err) {console.log(err);
// 		} else {
//       res.redirect('/authors');
//     }
//   });
// });

// DELETE user
router.delete('/:id', (req, res)=>{
  User.findByIdAndRemove(req.params.id, (err, deletedUser)=>{
    let articles = [];
    for(let i = 0; i < deletedUser.articles.length; i++){
      articles.push(deletedUser.articles[i]._id);
    };
    Article.remove(
      {
        _id: {
          $inc: articleIds
        }
      },
      (err, removedArticles)=>{
          req.session.destroy(()=>{
              res.redirect('/');
              });
          });
      });
  });


module.exports = router;
