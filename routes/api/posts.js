const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post Schema
const Post = require('../../models/Post');

const Profile = require('../../models/Profile');

// validation
const validatePostInput = require('../../validation/post');

router.get('/test', (req, res)=>{
    res.json({msg: "Posts Works"});
});


// @route   GET api/posts
// @desc    Get Posts
// @access  Public
router.get('/', (req, res)=>{
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({noPostsFound: 'No Posts found'}));
});


// @route   GET api/posts/:id
// @desc    Get Post by id
// @access  Public
router.get('/:id', (req, res)=>{
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({noPostFound: 'No Post found with that Id'}));
});


// @route   POST api/posts
// @desc    Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res)=>{
    const {errors, isValid} = validatePostInput(req.body);

    // Check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});


// @route   DELETE api/posts/:id
// @desc    Delete Post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}),(req, res)=>{
    Profile
        .findOne({user: req.user.id})
        .then(profile => {
            Post
                .findById(req.params.id)
                .then(post => {
                    // Check for Post owner
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({notAuthorized: 'User not authorized'});
                    }

                    // Delete
                    post.remove().then(() => res.json({success: true}));
                })
                .catch(err => res.status(404).json({postNotfound: 'Post not found'}));
        });
});

module.exports = router;