const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Author = require('./authors.js');


const articleSchema = mongoose.Schema({
  title: String,
  body: String
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
