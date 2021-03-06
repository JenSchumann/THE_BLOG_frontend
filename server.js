const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// const bcrypt = require('bcrypt');


app.use(methodOverride('_method'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));


app.use(session({
        secret: "everyonewantstheirfifteenminutesoffame",
        resave: false,
        saveUninitialized: false
}));


const articlesController = require('./controllers/articles.js');
app.use('/articles', articlesController);

const authorsController = require('./controllers/authors.js');
app.use('/authors', authorsController);

const sessionsController = require('./controllers/session.js');
app.use('/sessions', sessionsController);




app.get('/', (req, res)=>{
	res.render('index.ejs');
    // currentUser: req.session.currentUser
  });


const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/THE_Blog'
mongoose.connect(mongoUri);

mongoose.connection.once('open', ()=>{
  console.log('THE Bloooggg is connected to mongo');
});

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
  console.log('the world is waiting to hear the voice speak from THE Blogggggg');
  console.log('---------------------------------');
  console.log('Server running on port: ' + port);
  console.log('---------------------------------');
});
