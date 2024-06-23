import axios from 'axios';

const baseUrl = '/api/persons';

const getAll = async () => {
    try {
        const response = await axios.get(baseUrl);
        console.log('Data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const create = async (newObject) => {
    try {
        const response = await axios.post(baseUrl, newObject);
        console.log('Added:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding person:', error.response?.data || error.message);
        throw error.response?.data || new Error('Error adding person');
    }
};

const update = async (id, newObject) => {
    try {
        const response = await axios.put(`${baseUrl}/${id}`, newObject);
        console.log('Updated:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating person with id ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Error updating person');
    }
};

const remove = async (id) => {
    try {
        const response = await axios.delete(`${baseUrl}/${id}`);
        console.log('Deleted:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error deleting person with id ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Error deleting person');
    }
};

const personsService = { getAll, create, update, remove };

export default personsService;
