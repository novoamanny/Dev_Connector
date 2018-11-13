const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data){
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if(!validator.isLength(data.handle, {min: 2, max: 40})){
        errors.handle = 'Handle needs to between 2 - 40 characters';
    }

    if(validator.isEmpty(data.handle)){
        errors.handle = 'Profile handle is required';
    }

    if(validator.isEmpty(data.status)){
        errors.status = 'Status field is required';
    }

    if(validator.isEmpty(data.skills)){
        errors.skills = 'Skills field is required';
    }

    if(!isEmpty(data.youtube)){
        if(!validator.isURL(data.youtube)){
            errors.youtube = 'Not a valid URl';
        }
    }

    if(!isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter)){
            errors.twitter = 'Not a valid URl';
        }
    }

    if(!isEmpty(data.linkedIn)){
        if(!validator.isURL(data.linkedIn)){
            errors.linkedIn = 'Not a valid URl';
        }
    }

    if(!isEmpty(data.facebook)){
        if(!validator.isURL(data.facebook)){
            errors.facebook = 'Not a valid URl';
        }
    }

    

    return{
        errors,
        isValid: isEmpty(errors)
    }
}