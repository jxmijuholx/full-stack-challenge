const supertest = require('supertest');
const assert = require('assert');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');
const { TEST_MONGODB_URI } = require('../utils/config');
const {describe} = require('mocha');

const api = supertest(app);

describe('User API tests', () => {
  before(async () => {
    await mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should create a user with valid data', async () => {
    const newUser = { username: 'validuser', name: 'Valid User', password: 'validpassword' };
    
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.username, newUser.username);
    assert.strictEqual(response.body.name, newUser.name);
  });

  it('should not create a user with a short username', async () => {
    const newUser = { username: 'ab', name: 'Short Username', password: 'validpassword' };

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400);

    assert.strictEqual(response.body.error, 'Username must be at least 3 characters long');
  });

  it('should not create a user with a short password', async () => {
    const newUser = { username: 'validuser2', name: 'Short Password', password: 'ab' };

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400);

    assert.strictEqual(response.body.error, 'Password must be at least 3 characters long');
  });

  it('should not create a user with a duplicate username', async () => {
    const firstUser = { username: 'uniqueuser', name: 'First User', password: 'password123' };
    await api.post('/api/users').send(firstUser);

    const duplicateUser = { username: 'uniqueuser', name: 'Duplicate User', password: 'anotherpassword' };
    const response = await api.post('/api/users')
      .send(duplicateUser)
      .expect(400);

    assert.strictEqual(response.body.error, 'Username must be unique');
  });
});
