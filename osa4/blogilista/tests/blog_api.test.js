const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const api = supertest(app);

describe('Blogs API', function () {
  let token;
  let userId;

  before(async function () {
    await User.deleteMany({});
    await Blog.deleteMany({});

    // Create a user
    const user = new User({ username: 'testuser', password: 'password123' });
    await user.save();

    userId = user._id;

    // Generate token
    token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET, { expiresIn: '1h' });

    // Create a blog post
    const blog = new Blog({
      title: 'First Blog',
      author: 'John Doe',
      url: 'http://example.com',
      likes: 0,
      user: user._id,
    });

    await blog.save();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it('should return all blogs', async function () {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.at.least(1);
  });

  it('should create a new blog post with a valid token', async function () {
    const newBlog = {
      title: 'New Blog',
      author: 'Jane Doe',
      url: 'http://example.com/new',
      likes: 5,
    };

    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.title).to.equal(newBlog.title);
    expect(response.body.author).to.equal(newBlog.author);
    expect(response.body.url).to.equal(newBlog.url);
    expect(response.body.likes).to.equal(newBlog.likes);
  });

  it('should not create a blog post without a token', async function () {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Unauthorized Author',
      url: 'http://example.com/unauthorized',
      likes: 1,
    };

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(401); // Unauthorized
  });
});
