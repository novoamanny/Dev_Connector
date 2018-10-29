const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    User: {
        type: Schema.tyoe.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location:{
        type: String
    },
    status:{
        type : String,
        required: true
    },
    skills:{
        type: [String],
        required: true
    },
    bio: {
        tyoe: String
    },
    githubUserName:{
        type: String
    },
    experience:[
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location:{
                tyoe: String
            },
            from:{
                type: Date,
                required: true
            },
            to:{
                type: Date
            },
            current:{
                type: Boolean,
                default: false
            },
            description:{
                type: String
            }
        }
    ],
    education:[
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldOfStudy:{
                tyoe: String
            },
            from:{
                type: Date,
                required: true
            },
            to:{
                type: Date
            },
            current:{
                type: Boolean,
                default: false
            },
            description:{
                type: String
            }
        }
    ],
    social:{
        youtube:{
            type: String
        },
        twitter:{
            type: String
        },
        facebook:{
            type: String
        },
        linkedIn:{
            type: String
        },
    },
    date:{
        type: Date,
        default: Date.now
    }
});


module.exports = Profile = mongoose.model('profile', ProfileSchema);