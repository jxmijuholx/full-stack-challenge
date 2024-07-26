const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const { User } = require('../models/user');
const { userExtractor } = require('../utils/middleware');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {
        title: 1, author: 1, url: 1
      });
    response.json(users);
});

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

usersRouter.delete('/:id', async (request, response) => {
    await User.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

usersRouter.get('/all', userExtractor , async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash -__v');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

module.exports = usersRouter;
