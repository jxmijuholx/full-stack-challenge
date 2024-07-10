function dummy(blogs) {
    return 1;
}

function totalLikes(blogs) {
    return blogs.reduce(function(sum, blog) {
        return sum + blog.likes;
    }, 0);
}
  
function favoriteBlog(blogs) {
    if (blogs.length === 0) {
        return null;
    }
    return blogs.reduce((favorite, blog) => {
        if (favorite.likes > blog.likes) {
        return favorite;
        } else {
        return blog;
        }
    });
}
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }
  