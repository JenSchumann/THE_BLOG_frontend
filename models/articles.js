const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Author = require('./authors.js');

const articleSchema = mongoose.Schema({
  title: String,
  body: String
});

// articleSchema.get(function(val){
//     // Remove the _id from the Violations
//     delete val._id;
//     return val;
//   });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
