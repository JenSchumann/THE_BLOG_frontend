const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
          votes: Number,
          favs: Number
  }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
