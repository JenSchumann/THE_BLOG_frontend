const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const db = mongoose.connection;
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

//to test server at this stage, will later transfer routing to controller/articles.js file)

app.get('/', (req, res)=>{
	res.render('index.ejs');
});


const articlesController =
require('./controllers/articles.js');
app.use('/articles', articlesController);

const authorsController = require('./controllers/authors.js');
app.use('/authors', authorsController);




mongoose.connect('mongodb://localhost:27017/THE_Blog');

mongoose.connection.once('open', ()=>{
  console.log('THE Bloooggg is connected to mongo');
});

app.listen(3000, ()=>{
  console.log('the world is waiting to hear the voice speak from THE Blogggggg');
});
