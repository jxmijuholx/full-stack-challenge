import { useEffect, useRef, useState } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/loginService';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll()
        .then(blogs => setBlogs(blogs))
        .catch(error => {
          console.error('Error fetching blogs:', error);
          showNotification('Failed to fetch blogs. Please try again.', 'error');
        });
    }
  }, [user]);


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      showNotification('Login successful', 'success');
    } catch (exception) {
      console.error('Login failed:', exception);
      showNotification('Wrong credentials', 'error');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
    showNotification('Logged out successfully', 'success');
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObject)
      .then(newBlog => {
        setBlogs(blogs.concat(newBlog));
        showNotification(`Blog "${newBlog.title}" added successfully`, 'success');
      })
      .catch(error => {
        console.error('Error creating blog:', error);
        showNotification('Failed to create a new blog. Please try again.', 'error');
      });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);
  };

  return (
    <div>
      <h1>Bloglist</h1>
      <Notification message={notification.message} type={notification.type} />

      {!user ? (
        <Togglable buttonLabel="login">
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        </Togglable>
      ) : (
        <div>
          <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
 