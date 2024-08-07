import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, showNotification, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const handleLike = () => {
    if (!blog.user || !blog.user.id) {
      showNotification('Error: Blog user ID is missing', 'error')
      return
    }

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    blogService.update(blog.id, updatedBlog)
      .then(returnedBlog => {
        updateBlog(returnedBlog)
        showNotification(`Tykätty blogi: "${returnedBlog.title}"`, 'success')
      })
      .catch(error => {
        console.error('Epäonnistu broo:', error)
        showNotification('Ei onnistunu, koita uuestaa.', 'error')
      })
  }

  const handleDelete = () => {
    if (window.confirm(`Delete blog: "${blog.title}" by ${blog.author}?`)) {
      blogService.deleteBlog(blog.id)
        .then(() => {
          updateBlog(null, blog.id)
          showNotification(`Blog "${blog.title}" deleted successfully`, 'success')
        })
        .catch(error => {
          console.error('Error deleting blog:', error)
          showNotification('Failed to delete blog. Please try again.', 'error')
        })
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      Title: {blog.title}<br /> Author: {blog.author} <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <div style={{ display: visible ? '' : 'none' }}>
        <p>Url: {blog.url}</p>
        <p>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>User in blog: {blog.user ? blog.user.username : 'Unknown user'}</p>
        {blog.user && blog.user.username === currentUser.username && (
          <p>
            <button onClick={handleDelete}>remove</button>
          </p>
        )}
      </div>
    </div>
  )
}

export default Blog
