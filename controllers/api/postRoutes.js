const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const posts = await Post.findOne({
            where: {
                id: req.params.id
            },
            include: [User]
        });
        res.render('editpost', {
            posts,
        });
        // res.status(200).json(posts)
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/:id', withAuth, async (req, res) => {
    try {
        const posts = await Post.findOne({
            where: {
                id: req.params.id
            },
            include: [User]
        });
        const commentData = await Comment.findAll({
            where:{
                post_id: req.params.id
            },
            include:[User]
        });
        const comments = commentData.map(comment => comment.get({plain:true}))
        res.render('post', {
            posts,
            comments
        });
        // res.status(200).json(posts)
    } catch (err) {
        res.status(400).json(err);
    }
});

//route is working but couldnt render it correctly
router.put('/edit/:id', withAuth, async (req, res) => {
    try {
        const [affectedRows] = await Post.update(req.body, {
            where: {
                id: req.params.id,
            }
        })
        if (affectedRows > 0) {
            // res.status(200).end();
            res.status(200),json(affectedRows);
        }
        console.log(affectedRows);
    } catch (err) {
        res.status(400).json(err);
    }
});

// router.post('/', withAuth, async (req, res) => {
//     try {
//         const newPost = await Post.create({
//             ...req.body,
//             user_id: req.session.user_id,
//         });

//         res.status(200).json(newPost);
//     } catch (err) {
//         res.status(400).json(err);
//     }
// });

router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        console.log(newPost);

        res.status(200).json(newPost);

    } catch (err) {
        res.status(400).json(err);
    }
});

// router.put('/editpost', async (req, res) => {
//     console.log(req.body);
//     try {
//         const updatePost = await Post.update(
//             req.body.description,
//             {
//                 where: {
//                     id: req.body.id,
//                 },
//             })
//         console.log(updatePost);
//         res.status(200).json(updatePost);
//     } catch (err) {
//         res.status(400).json(err);
//     }
// });


router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(404).json({ message: 'No project found with this id!' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
