const bcrypt = require('bcrypt')
const { test, expect, beforeEach, describe, toBeDefined, toBeUndefined } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const User = require('../models/user');

describe('kun on käyttäjä ;)', () => {
    beforeEach( async() => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('salasana', 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
    })

    test('post works' , async () => {
        const ekat = await helper.usersInDb()

        const newUser = {
            username: 'roope',
            name: 'roope',
            password: 'salasana',
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const tokat = await helper.usersInDb()
        expect(tokat).toHaveLength(ekat.length + 1)

        const usernames = tokat.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
})