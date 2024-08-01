import React, { useState } from 'react';

const Blog = ({ blog }) => {

  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  return (
    <div style={blogStyle}>
      {blog.title} by {blog.author} <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <div style={{ display: visible ? '' : 'none' }}>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button>like</button>
        </p>
        <p>{blog.username}</p>
      </div>
    </div>
  );
};

export default Blog;
