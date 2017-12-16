const express = require('express');
const router = express.Router();
const Article = require('../models/articles.js');
const Author = require('../models/authors.js');
const bcrypt = require('bcrypt');

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
    Author.find({}, (err, allAuthors)=>{
        res.render('articles/new.ejs', {
            authors: allAuthors,
            userSession: req.session
        });
    });
});

//create
router.post('/', (req, res)=>{
  console.log("this is req.body.articleId is..", req.body.articleId);
  Author.findById(req.body.authorId, (err, foundAuthor)=>{
    req.body.name = req.session.username
  Article.create(req.body, (err, createdArticle)=>{
    console.log("createdArticle:", createdArticle );


      foundAuthor.articles.push(createdArticle);
      foundAuthor.save((err, data)=>{
          res.redirect('/articles');
      });
    });
  });
});

// get newly created article.. SHOW Page
router.get('/:id', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    Author.findOne({'articles._id':req.params.id}, (err, foundAuthor)=>{
      res.render('articles/show.ejs', {
          article: foundArticle,
          author: foundAuthor

      });
    });
  });
});

//Edit
router.get('/:id/edit', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    Author.find({}, (err, allAuthors)=>{
        Author.findOne({'articles._id':req.params.id}, (err, foundArticleAuthor)=>{
              res.render('articles/edit.ejs', {
                    article: foundArticle,
                    author: allAuthors,
                    articleAuthor: foundArticleAuthor,
                    userSession: req.session
        });
      });
    });
  });
});


//update
router.put('/:id', (req, res)=>{
  Article.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedArticle)=>{
      Author.findOne({ 'articles._id' : req.params.id }, (err, foundAuthor)=>{
        console.log("-------------", req.params.id);
        if(foundAuthor._id.toString() !== req.body.authorId) {
          foundAuthor.articles.id(req.params.id).remove();
          foundAuthor.save((err, savedFoundAuthor)=>{
              Author.findById(req.body.authorId, (err, newAuthor)=>{
                    newAuthor.articles.push(updatedArticle);
                    newAuthor.save((err, savedNewAuthor)=>{
                            res.redirect('/articles/'+req.params.id);
                    });
                });
            });
        } else {
                  foundAuthor.articles.id(req.params.id).remove();
                  foundAuthor.articles.push(updatedArticle);
                  foundAuthor.save((err, data)=>{
                            res.redirect('/articles/'+req.params.id);
                  });
        }
    });
  });
});

//delete
router.delete('/:id', (req, res)=>{
  Article.findByIdAndRemove(req.params.id, (err, foundArticle)=>{
    Author.findOne({'articles._id':req.params.id}, (err, foundAuthor)=>{
      foundAuthor.articles.id(req.params.id).remove();
      foundAuthor.save((err, data)=>{
        res.redirect('/articles');
      });
    });
  });
});

module.exports = router;
