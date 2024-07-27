import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.get(baseUrl, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized - Invalid or expired token');
    } else {
      console.error('Error fetching blogs:', error.message);
    }
    throw error;
  }
};


const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized - Invalid or expired token');
    }
    throw new Error('Unable to create blog');
  }
};

export default { getAll, create, setToken };
