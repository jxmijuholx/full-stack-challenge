const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})
blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes = 0, user } = request.body;

    // Extract userId from the user object
    if (!user || !user.id) {
        return response.status(400).json({ error: 'User ID is required' });
    }
    const userId = user.id;

    // Check for missing required fields
    if (!title) {
        return response.status(400).json({ error: 'Title is required' });
    }
    if (!url) {
        return response.status(400).json({ error: 'URL is required' });
    }

    // Check if user exists
    const userRecord = await User.findById(userId);
    if (!userRecord) {
        return response.status(400).json({ error: 'Invalid User ID' });
    }

    // Create and save the new blog
    const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: userRecord._id
    });

    const savedBlog = await blog.save();
    userRecord.blogs = userRecord.blogs.concat(savedBlog._id);
    await userRecord.save();

    response.status(201).json(savedBlog);
});



blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (blog) {
        response.status(204).end()
    } else {
        response.status(400).json({ error: 'Invalid ID' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        { new: true }
    )
    response.status(200).json(updatedBlog)
})

blogsRouter.patch('/:id', async (request, response) => {
    const { likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes },
        { new: true }
    )
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
