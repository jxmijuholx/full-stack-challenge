const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User  = require('../models/user');

const getTokenFrom = req => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7);
    }
    return null;
  };
  
  blogsRouter.get('/', async (req, res) => {
    const token = getTokenFrom(req);
  
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!decodedToken.id) {
        return res.status(401).json({ error: 'Token invalid' });
      }
  
      const user = await User.findById(decodedToken.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
      res.json(blogs);
    } catch (error) {
      console.error('Error decoding token or fetching data:', error.message);
      res.status(401).json({ error: 'Token invalid' });
    }
  });

blogsRouter.get('/:id', async (req, res) => {
    const token = getTokenFrom(req);
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            const user = await User.findById(decodedToken.id).exec();
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
            const blog = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1 });
            if (blog) {
                res.json(blog);
            } else {
                res.status(404).end();
            }
        } catch (error) {
            res.status(401).json({ error: 'Token invalid' });
        }
    } else {
        res.status(401).json({ error: 'Token missing' });
    }
});

blogsRouter.post('/', async (req, res) => {
    const token = getTokenFrom(req);
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            const user = await User.findById(decodedToken.id).exec();
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
            const { title, author, url, likes = 0 } = req.body;
            if (!title || !url) {
                return res.status(400).json({ error: 'Title and URL are required' });
            }
            const blog = new Blog({
                title,
                author,
                url,
                likes,
                user: user._id,
            });
            const savedBlog = await blog.save();
            user.blogs = user.blogs.concat(savedBlog._id);
            await user.save();
            res.status(201).json(savedBlog);
        } catch (error) {
            res.status(401).json({ error: 'Token invalid' });
        }
    } else {
        res.status(401).json({ error: 'Token missing' });
    }
});

blogsRouter.delete('/:id', async (req, res) => {
    const token = getTokenFrom(req);
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            const user = await User.findById(decodedToken.id).exec();
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
            const blog = await Blog.findById(req.params.id);
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            if (blog.user.toString() !== user._id.toString()) {
                return res.status(403).json({ error: 'Permission denied: Only the creator can delete this blog' });
            }
            await Blog.findByIdAndDelete(req.params.id);
            res.status(204).end();
        } catch (error) {
            res.status(401).json({ error: 'Token invalid' });
        }
    } else {
        res.status(401).json({ error: 'Token missing' });
    }
});

blogsRouter.put('/:id', async (req, res) => {
    const token = getTokenFrom(req);
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            const user = await User.findById(decodedToken.id).exec();
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
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
        } catch (error) {
            res.status(401).json({ error: 'Token invalid' });
        }
    } else {
        res.status(401).json({ error: 'Token missing' });
    }
});

blogsRouter.patch('/:id', async (req, res) => {
    const token = getTokenFrom(req);
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            const user = await User.findById(decodedToken.id).exec();
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
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
        } catch (error) {
            res.status(401).json({ error: 'Token invalid' });
        }
    } else {
        res.status(401).json({ error: 'Token missing' });
    }
});

module.exports = blogsRouter;
