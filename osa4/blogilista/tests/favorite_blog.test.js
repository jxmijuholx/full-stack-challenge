const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('favoriteBlog', () =>{
    test('of empty list is null', () => {
        const blogs = [];
        const result = listHelper.favoriteBlog(blogs);
        assert.strictEqual(result, null);
      });

    test( 'when list has only one blog equals that blog', () =>{
        const blogs = [
            {
            title: 'Jami Juhola',
            author: 'Jami Juhola',
            url: 'http://oonparas.com',
            likes: 69
            }
        ];
        const result = listHelper.favoriteBlog(blogs);
        assert.strictEqual(result, blogs[0]);
    })

    test('of a bigger list is found right', () => {
        const blogs = [
        {
            title: 'Meow',
            author: 'Kissa',
            url: 'http://kissa.fi',
            likes: 0
        },
        {
            title: 'Hau',
            author: 'Koira',
            url: 'http://koira.net',
            likes: 10
        },
        {
            title: 'Otsikko',
            author: 'Kirjoittaja',
            url: 'http://kirjoittaja.com',
            likes: 420
        }
        ];
        const result = listHelper.favoriteBlog(blogs);
        assert.strictEqual(result, blogs[2]);
    });
})