const mongoose = require('mongoose');
const Article = require('./articles.js');


const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "assets/beer-mug-silhouette-144-278747.png" },
    about: { type: String },
    // articles: { type: [Article.schema] }
    articles: [Article.schema],
});





module.exports = mongoose.model('UserSchema', UserSchema)




// add to schema:
//
// faveSaying: { type: String },
// faveBeer: { type: String },
// faveFtBallTeam: { type: String }
