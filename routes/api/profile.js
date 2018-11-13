const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');

// Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.get('/test', (req, res)=>{
    res.json({msg: "Profile Works"});
});

// GET current user's profile
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const errors = {};

    Profile
        .populate('user', ['name'])
        .findOne({user: req.user.id})
        .then(profile =>{

            if(!profile){
                errors.noProfile = 'There is no profile for this user... '
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


// @route   GET api/profile/handle/:handle
// @desc    get profile b handle
// @access  Private
router.get('/handle/:handle', (req, res) =>{
    const errors = {};

    Profile.findOne({handle: req.params.handle})
        .populate('user', ['name'])
        .then(profile =>{
            if(!profile){
                errors.noProfile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all',(req, res)=>{
    Profile.find()
        .populate('user', ['name'])
        .then(profiles =>{
            if(!profiles){
                errors.noProfile = 'There is no profiles';
                return res.status(404).json(errors);
            }

            res.json(profiles);
        })
        .catch(err => res.status(404).json({profile:' There are no profiles'}));

});


// @route   GET api/profile/user/:user_id
// @desc    get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) =>{
    const errors = {};

    Profile.findOne({user: req.params.user_id})
        .populate('user', ['name'])
        .then(profile =>{
            if(!profile){
                errors.noProfile = 'There is no profile for this user';
                return res.status(404).json({profile: 'There is no profile'});
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});



//@route POST api/profile
// @desc Create or edit user Profile
// @access Private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) =>{
    
    const{errors, isValid} = validateProfileInput(req.body);

    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    
    // get fields
    const profileFields ={};
    profileFields.user = req.user.id;

    // check if sent
    if(req.body.handle){
        profileFields.handle = req.body.handle;
    }
    if(req.body.company){
        profileFields.comapany = req.body.comapany;
    }
    if(req.body.website){
        profileFields.website = req.body.website;
    }
    if(req.body.location){
        profileFields.location = req.body.location;
    }
    if(req.body.bio){
        profileFields.bio = req.body.bio;
    }
    if(req.body.status){
        profileFields.status = req.body.status;
    }
    if(req.body.githubUserName){
        profileFields.githubUserName = req.body.githubUserName;
    }

    // Skills - Split into in array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if(req.body.youtube){
        profileFields.social.youtube = req.body.youtube;
    }
    if(req.body.twitter){
        profileFields.social.twitter = req.body.twitter;
    }
    if(req.body.facebook){
        profileFields.social.facebook = req.body.facebook;
    }
    if(req.body.linedIn){
        profileFields.social.linkedIn = req.body.linkedIn;
    }

    Profile
        .findOne({user: req.user.id})
        .then(profile => {
            if(profile){
                // Update
                Profile
                    findOneAndUpdate(
                        {user: req.user.id}, 
                        {$set: profileFields}, 
                        {new: true})
                    .then(profile => res.json(profile));
            }else{
                // Create

                // Check if handle exits
                Profile
                    .findOne({handle: profileFields.handle})
                    .then(profile => {
                        if(profile){
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }

                        // Save Profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    });
            }
        });
});


module.exports = router;