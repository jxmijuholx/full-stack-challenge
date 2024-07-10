const { test, after, beforeEach, describe, toBeDefined, toBeUndefined } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  describe('GET /api/blogs', () => {
    test('blogs are returned in json format', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test('blog objects have id field instead of _id', async () => {
      const response = await api.get('/api/blogs');
      const blogs = response.body;

      blogs.forEach(blog => {
        assert(blog.id, 'blog id on id eikä _id');
        assert(blog._id === undefined, 'blog _id ei ole määritelty');
      });
    });
  });

  describe('POST /api/blogs', () => {
    test('a valid blog can be added with likes defaulting to 0', async () => {
      const newBlog = {
        title: 'uusi blogi',
        author: 'testi author',
        url: 'testi url',
      };
      const initialBlogs = await api.get('/api/blogs');
      const summa = initialBlogs.body.length;

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const addedBlog = response.body;
      assert.strictEqual(addedBlog.likes, 0);

      const blogs = await api.get('/api/blogs');
      const blogsAfterAdd = blogs.body;

      assert.strictEqual(blogsAfterAdd.length, summa + 1);
    });

    test('responds with 400 if title and url are missing', async () => {
      const newBlog = {
        author: 'äitis',
        likes: 420
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

      const response = await api.get('/api/blogs');
      const blogs = response.body;

      assert.strictEqual(blogs.length, helper.initialBlogs.length);
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blog = await Blog.findOne({});
      await api
        .delete(`/api/blogs/${blog.id}`)
        .expect(204);

      const blogs = await Blog.find({});
      assert.strictEqual(blogs.length, helper.initialBlogs.length - 1);
    });

    test('fails with status code 400 if id is invalid', async () => {
      await api
        .delete('/api/blogs/69')
        .expect(400);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
