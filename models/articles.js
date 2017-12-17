const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.js');


const articleSchema = mongoose.Schema({
  title: String,
  body: String
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
