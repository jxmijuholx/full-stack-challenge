const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/user');

const loginSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).required()
});

loginRouter.post('/', async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const userForToken = {
        username: user.username,
        id: user._id
    };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, username: user.username, name: user.name, id: user._id });
});

module.exports = loginRouter;
