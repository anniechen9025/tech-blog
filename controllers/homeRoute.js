const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Post, Comment } = require('../models');

// GET all posts for homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [User]
    })
    const posts = postData.map(post => post.get({
      plain: true
    }))
    res.render('homepage', {
      posts
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

router.get('/newpost', withAuth, (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('newpost');
});

router.get('/editpost', withAuth, (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('editpost');
});

router.get('/newcomment', withAuth, async (req, res) => {
  try {
    res.render('newcomment');
  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;
