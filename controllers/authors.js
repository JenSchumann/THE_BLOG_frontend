const express = require('express');
const router = express.Router();
const Author = require('../models/authors.js');
const Article = require('../models/articles.js');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

//index: GET route
router.get('/', (req, res)=>{
	console.log(req.session, "this is req.session in the route /author");
	// if(req.session.logged){
				Author.find({}, (err, foundAuthors)=>{
					res.render('./authors/index.ejs', {
						authors: foundAuthors,
						userSession: req.session
					});
				});
	// } else {
		// res.redirect('/users/login')
	// }
});

router.get('/new', (req, res)=>{
	res.render('authors/new.ejs', {
		userSession: req.session
	});
});

router.post('/', (req, res)=>{
	Author.create(req.body, (err, createdAuthor)=>{
		res.render('authors/show.ejs', {
			//trying this
			author: createdAuthor,
			userSession: req.session
		});
	});
});


// seed data route to seed.js file
router.get('/seed', (req, res)=>{
  Author.insertMany(authorSeed, (err, authors) =>{
    if(err) {console.log(err);
		} else {
      res.redirect('/authors');
    }
  });
});

//author SHOW page
router.get('/:id', (req,res)=>{
  Author.findById(req.params.id, (err, foundAuthor)=>{
		console.log(foundAuthor);
		//was 'authors._id'
		Article.findById({'article._id':req.params.id}, (err, foundArticle)=>{
    			res.render('authors/show.ejs', {
        author: foundAuthor,
				articles: foundArticle,
				userSession: req.session
			});
    });
  });
});

router.get('/:id/edit', (req, res)=>{
  Author.findById(req.params.id, (err, foundAuthor)=>{
    res.render('authors/edit.ejs', {
      author: foundAuthor,
			userSession: req.session
    });
  });
});

router.put('/:id', (req, res)=>{
  Author.findByIdAndUpdate(req.params.id, req.body, ()=>{
    res.redirect('/authors');
  });
});

router.delete('/:id', (req, res)=>{
  Author.findByIdAndRemove(req.params.id, (err, foundAuthor)=>{
            const articleIds = [];
            for (let i = 0; i < foundAuthor.articles.length; i++) {
                  articleIds.push(foundAuthor.articles[i]._id);
            }
            Article.remove(
                    {
                          _id : {
                                  $in: articleIds
                          }
                    },
                    (err, data)=>{
                          res.redirect('/authors');
                    }
            );
  });
});



module.exports = router;
