const express = require('express');
const router = express.Router();
const Article = require('../models/articles.js');
const Author = require('../models/authors.js');
const User = require('../models/users');

//index
router.get('/', (req, res)=>{
  if(req.session.logged){
      Article.find({}, (err, foundArticles)=>{
        // res.json(foundArticles);
        res.render('articles/index.ejs', {
          articles: foundArticles
        });
      })
  } else {
      res.redirect('/users/login')
      //send message to user about redirect
  }
});

router.get('/new', (req, res)=>{
    Author.find({}, (err, allAuthors)=>{
        res.render('articles/new.ejs', {
            authors: allAuthors
        });
    });
});

//create
router.post('/', (req, res)=>{
  Author.findById(req.body.authorId, (err, foundAuthor)=>{
    Article.create(req.body, (err, createdArticle)=>{
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
          author: foundAuthor,
          article: foundArticle
      });
    })
  });
});

//Edit
router.get('/:id/edit', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    Author.find({}, (err, allAuthors)=>{
        Author.findOne({'articles._id':req.params.id}, (err, foundArticleAuthor)=>{
              res.render('articles/edit.ejs', {
                    article: foundArticle,
                    authors: allAuthors,
                    articleAuthor: foundArticleAuthor
        });
      });
    });
  });
});


//update
router.put('/:id', (req, res)=>{
  Article.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedArticle)=>{
      Author.findOne({ 'articles._id' : req.params.id }, (err, foundAuthor)=>{
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
