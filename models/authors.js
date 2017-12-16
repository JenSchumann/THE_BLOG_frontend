const mongoose = require('mongoose');
const Article = require('./articles.js');


const authorSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: 'try this' },
  about: { type: String },
  articles: { type: [Article.schema] }

});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;


//
// add to schema:
//
// faveSaying: { type: String },
// faveBeer: { type: String },
// faveFtBallTeam: { type: String }
