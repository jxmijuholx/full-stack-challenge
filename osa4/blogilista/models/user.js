const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    name: String,
    passwordHash: {
        type: String,
        required: true,
        minlength: 3
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET, { expiresIn: '1d' });
    return token;
};

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

const validate = (user) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        name: Joi.string().required(),
        password: Joi.string().required()
    })
    return schema.validate(user)
}

module.exports = {User, validate}
