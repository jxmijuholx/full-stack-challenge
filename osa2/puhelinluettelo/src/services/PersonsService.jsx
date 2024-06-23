import axios from 'axios';

const baseUrl = 'https://puhelinluettelo-backend-zjzz.onrender.com/api/persons';

const getAll = async () => {
    try {
        const response = await axios.get(baseUrl);
        console.log('Data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Errori, ei saatu dataa bro:', error);
    throw error;
}
};

const create = async newObject => {
  try {
    const response = await axios.post(baseUrl, newObject);
    console.log('Lisätty:', response.data);
    return response.data;
  } catch (error) {
      console.log('Virhe henkilön lisäämisessä',response.data);
  }
};

const update = async (id, newObject) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject);
    console.log('Päivitetty:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Virhe päivttämises bro, tos id: ${id}:`, error);
    throw error;
  }
};

const remove = async id => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);
    console.log('Poistettu:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Ei ny onnannu poistaa, id sulle tost: id ${id}:`, error);
    throw error;
  }
};

const personsService = { getAll, create, update, remove };

export default personsService;
