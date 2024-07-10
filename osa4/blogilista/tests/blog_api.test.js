const { test, after, beforeEach, describe, toBeDefined, toBeUndefined } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned in json format blyat', async () => {
    const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogeil on id kunnos brudda', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

  blogs.forEach(blog => {
    assert(blog.id, 'blog id on id eikä _id')
    assert(blog._id === undefined, 'blog _id ei ole määritelty')
  });
})

test('post toimii ja liket nollana bro', async () =>{
  const newBlog = {
    title: 'uusi blogi',
    author: 'testi author',
    url: 'testi url',
  }
  const initialBlogs = await api.get('/api/blogs')
  const summa = initialBlogs.body.length

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const addedBlog = response.body
  assert.strictEqual(addedBlog.likes, 0)

  const blogs = await api.get('/api/blogs')
  const blogsAfterAdd = blogs.body

  assert.strictEqual(blogsAfterAdd.length, summa + 1)
})

test('jos title ja url puuttuu, palautetaan 400', async () => {
  const newBlog = {
    author: "äitis",
    likes: 420
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    const response = await api.get('/api/blogs')
    const blogs = response.body

  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})
})