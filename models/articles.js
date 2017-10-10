const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  author: String,
  article: String
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
