const express = require('express');
const router = express.Router();
const Article = require('../models/articles.js');
const User = require('../models/user.js');
const bcrypt = require('bcrypt-nodejs');


//index
router.get('/', (req, res)=>{
  console.log(req.session);
  if(req.session.logged){
      Article.find({}, (err, foundArticle)=>{
        console.log(foundArticle);
        res.render('./articles/index.ejs', {
          article: foundArticle,
          userSession: req.session
        });
      });
  } else {
      res.redirect('/sessions/login')
      // send message to user about redirect
  }
});

router.get('/new', (req, res)=>{
    User.find({}, (err, allUsers)=>{
        res.render('articles/new.ejs', {
            users: allUsers,
            userSession: req.session
        });
    });
});

//create
//this where the issue is of why the articles are not getting pushed to author array
router.post('/', (req, res)=>{
  console.log("this is req.body.articleId is..", req.body.articleId);
  User.findById(req.body.userId, (err, foundUser)=>{
    //taking out this

    //maybe I should use this instead?
    // req.body.name = req.session.username
    //and putting this
    currentUser: req.session.currentUser
  Article.create(req.body, (err, createdArticle)=>{
    console.log("createdArticle:", createdArticle );
//trying singular instead of this:
// foundUser.articles.push(createdArticle);
      foundUser.articles.push(createdArticle);
      foundUser.save((err, data)=>{
          res.redirect('/articles');
      });
    });
  });
});

// get newly created article.. SHOW Page
router.get('/:id', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    User.findOne({'articles._id':req.params.id}, (err, foundUser)=>{
      res.render('articles/show.ejs', {
          article: foundArticle,
          user: foundUser

      });
    });
  });
});

//Edit
router.get('/:id/edit', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    User.find({}, (err, allUsers)=>{
        User.findOne({'articles._id':req.params.id}, (err, foundArticleUser)=>{
              res.render('articles/edit.ejs', {
                    article: foundArticle,
                    user: allUsers,
                    articleUser: foundArticleUser,
                    userSession: req.session
        });
      });
    });
  });
});


//update
router.put('/:id', (req, res)=>{
  Article.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedArticle)=>{
      User.findOne({ 'articles._id' : req.params.id }, (err, foundUser)=>{
        console.log("-------------", req.params.id);
        if(foundUser._id.toString() !== req.body.userId) {
          foundUser.articles.id(req.params.id).remove();
          foundUser.save((err, savedFoundUser)=>{
              User.findById(req.body.userId, (err, newUser)=>{
                    newUser.articles.push(updatedArticle);
                    newUser.save((err, savedNewUser)=>{
                            res.redirect('/articles/'+req.params.id);
                    });
                });
            });
        } else {
                  foundUser.articles.id(req.params.id).remove();
                  foundUser.articles.push(updatedArticle);
                  foundUser.save((err, data)=>{
                            res.redirect('/articles/'+req.params.id);
                  });
        }
    });
  });
});

//delete
router.delete('/:id', (req, res)=>{
  Article.findByIdAndRemove(req.params.id, (err, foundArticle)=>{
    User.findOne({'articles._id':req.params.id}, (err, foundUser)=>{
      foundUser.articles.id(req.params.id).remove();
      foundUser.save((err, data)=>{
        res.redirect('/articles');
      });
    });
  });
});

module.exports = router;
