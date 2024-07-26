const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const  User  = require('../models/user');

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || username.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }
    if (!password || password.length < 3) {
        return res.status(400).json({ error: 'Password must be at least 3 characters long' });
    }

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
