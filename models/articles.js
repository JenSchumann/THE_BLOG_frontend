const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const articleSchema = mongoose.Schema({
const articleSchema = new Schema({
  author: String,
  article: String
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
