const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

//to test server at this stage, will later transfer routing to controller/articles.js file)

app.get('/', (req, res)=>{
  res.send('this is theeee BLOOOOGGGGGGG!')
  console.log('thissss issss theeeeeeeeee BLOOOOOOOGGGGGGGGGGGGGGGG!!!!! echo echo echo');
});

const articlesController =
require('./controllers/articles.js');
app.use('/articles', articlesController);

mongoose.connect('mongodb://localhost:28888/THE_Blog');
mongoose.connection.once('open', ()=>{
  console.log('THE Bloooggg is connected to mongo');
});

app.listen(3000, ()=>{
  console.log('the world is waiting to hear the voice speak from THE Blogggggg');
});
