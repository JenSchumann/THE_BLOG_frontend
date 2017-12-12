const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const db = mongoose.connection;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

//to test server at this stage, will later transfer routing to controller/articles.js file)
app.get('/articles/new', (req, res)=>{
  res.send('new article happening here');
});

const articlesController =
require('./controllers/articles.js');
app.use('/articles', articlesController);




mongoose.connect('mongodb://localhost:27017/THE_Blog');

mongoose.connection.once('open', ()=>{
  console.log('THE Bloooggg is connected to mongo');
});

app.listen(3000, ()=>{
  console.log('the world is waiting to hear the voice speak from THE Blogggggg');
});
