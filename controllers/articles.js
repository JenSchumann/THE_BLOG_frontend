const express = require('express');
const router = express.Router();
const Article = require('../models/articles.js');

//index
router.get('/', (req, res)=>{
  Article.find({}, (err, foundArticles)=>{
    // res.json(foundArticles);
    res.render('articles/index.ejs', {
      articles: foundArticles
    });
  })
});

router.get('/new', (req, res)=>{
  res.render('articles/new.ejs');
});

//create
router.post('/', (req, res)=>{
  console.log(req.body)
  Article.create(req.body, (err, createdArticle)=>{
    res.redirect('/articles');
  });
});

// get newly created article.. SHOW Page
router.get('/:id', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    res.render('articles/show.ejs', {
      article: foundArticle
    });
  });
});

//Edit
router.get('/:id/edit', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    res.render('articles/edit.ejs', {
      article: foundArticle
    });
  });
});


//update
router.put('/:id', (req, res)=>{
  Article.findByIdAndUpdate(req.params.id, req.body, ()=>{
    res.redirect('/articles');
  });
});

//delete
router.delete('/:id', (req, res)=>{
  Article.findByIdAndRemove(req.params.id, ()=>{
    res.redirect('/articles');
  });
});

module.exports = router;
