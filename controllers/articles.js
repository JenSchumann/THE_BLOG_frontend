const express = require('express');
const router = express.Router();
const Article = require('../models/articles.js');

//index
router.get('/', (req, res)=>{
  // Article.find({}, (err, foundArticles)=>{
    // res.json(foundArticles);
    res.render('articles/index.ejs');
  // });
});

//create
router.post('/', (req, res)=>{
  console.log(req.body)
  Article.create(req.body, (err, createdArticle)=>{
    res.json(createdArticle);
  });
});

//update
router.put('/:id', (req, res)=>{
  Article.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedArticle)=>{
    res.json(updatedArticle);
  });
});

//delete
router.delete('/:id', (req, res)=>{
  Article.findByIdAndRemove(req.params.id, (err, deletedArticle)=>{
    res.json(deletedArticle);
  });
});

module.exports = router;
