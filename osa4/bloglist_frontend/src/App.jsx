import { useEffect, useState } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/loginService';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    if (user) {
      blogService.getAll()
        .then(blogs => setBlogs(blogs))
        .catch(error => {
          console.error('Error fetching blogs:', error);
          setErrorMessage('Failed to fetch blogs. Please try again.');
        });
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      showNotification('Onnas broo', 'success');
    } catch (exception) {
      showNotification('Wrong credentials', 'error');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
    showNotification('Logged out successfully', 'success');
  };

  const handleBlogChange = ({ target }) => {
    setNewBlog({ ...newBlog, [target.name]: target.value });
  };

  const addBlog = (event) => {
    event.preventDefault();
    blogService.create(newBlog)
      .then(data => {
        setBlogs(blogs.concat(data));
        setNewBlog({ title: '', author: '', url: '' });
        showNotification(`Blog "${data.title}" added successfully`, 'success');
      })
      .catch(error => {
        console.error('Error creating blog:', error);
        showNotification('Et onnistunut lisää blogii bro.', 'error');
      });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '' , type: ''});
    }, 5000);
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        author
        <input
          type="text"
          name="author"
          value={newBlog.author}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        url
        <input
          type="text"
          name="url"
          value={newBlog.url}
          onChange={handleBlogChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>blogs</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {!user ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
        </div>
      )}
      <ul>
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </ul>
    </div>
  );
};

export default App;
