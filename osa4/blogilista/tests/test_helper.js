const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Jami Juhola',
        author: 'Jami Juhola',
        url: 'LOL.FI',
        likes: 69
    },
    {
        title: 'Jami Juhola',
        author: 'Jami Juhola',
        url: 'pääskii.com',
        likes: 420
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ content: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
  }
  
  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blogs => blog.toJSON())
  }
  
  module.exports = {
    initialBlogs, nonExistingId, blogsInDb
  }