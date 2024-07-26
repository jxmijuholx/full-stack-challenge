const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { User } = require('../models/user');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1 });
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post('/', userExtractor, async (req, res) => {
  const { title, author, url, likes = 0 } = req.body;
  const user = req.user;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id 
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  if (blog.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Permission denied: Only the creator can delete this blog' });
  }

  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

blogsRouter.put('/:id', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true }
  ).populate('user', { username: 1, name: 1 });

  if (updatedBlog) {
    res.status(200).json(updatedBlog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.patch('/:id', userExtractor, async (req, res) => {
  const { likes } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
    { new: true }
  ).populate('user', { username: 1, name: 1 });

  if (updatedBlog) {
    res.status(200).json(updatedBlog);
  } else {
    res.status(404).end();
  }
});

module.exports = blogsRouter;
