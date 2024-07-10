const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
    })

blogsRouter.get('/:id', async(request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    if (!blog.likes) {
        blog.likes = 0
      }

    if (!blog.title || !blog.url) {
        return response.status(400).json({ error: 'title tai url puuttuu weli' })
    }

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
});

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (blog) {
      response.status(204).end()
    } else if( !blog.id) {
      response.status(400).json({ error: 'invalid id' })
    }
});

blogsRouter.put('/:id', async (request, response)=> {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog)
})

blogsRouter.patch('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog)
})



module.exports = blogsRouter