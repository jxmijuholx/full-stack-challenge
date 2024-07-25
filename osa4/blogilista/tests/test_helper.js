const Blog = require('../models/blog')
const User = require('../models/user')

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

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
  module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
  }