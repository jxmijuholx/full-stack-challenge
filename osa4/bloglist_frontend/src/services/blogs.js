import axios from 'axios';
const baseUrl = '/api/blogs';

axios.defaults.withCredentials = true;

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
  console.log('Token set:', token);
};

const getAll = async() => {
  const config = {
    headers: { Authorization: token },
  };
  console.log('Request config:', config);
  const response = await axios.get(baseUrl, config);
  console.log('Response data:', response.data);
  return response.data;
}



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

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized - Invalid or expired token');
    }
    throw new Error('Unable to update blog');
  }
}

const deleteBlog = async (id) =>{
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized - Invalid or expired token');
    }
    throw new Error('Unable to delete blog');
  }
}

export default { getAll, create, setToken, update, deleteBlog };
