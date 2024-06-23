import React, { useEffect, useState } from 'react';
import FilterForm from './components/FilterForm';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import './index.css';
import personsService from './services/PersonsService';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        personsService.getAll().then(initialPersons => {
            setPersons(initialPersons);
        }).catch(error => {
            setErrorMessage(`Error fetching data: ${error.message}`);
            setTimeout(() => setErrorMessage(null), 5000);
        });
    }, []);

    const addPerson = (event) => {
        event.preventDefault();
        const personObject = {
            name: newName,
            number: newNumber,
        };

        const existingPerson = persons.find(person => person.name === newName);
        if (existingPerson) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                personsService.update(existingPerson.id, personObject)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
                        setNewName('');
                        setNewNumber('');
                        setSuccessMessage(`Updated ${newName}'s number`);
                        setTimeout(() => setSuccessMessage(null), 5000);
                    })
                    .catch(error => {
                        setErrorMessage(`Error updating ${newName}'s number: ${error.error || error.message}`);
                        setTimeout(() => setErrorMessage(null), 5000);
                    });
            }
        } else {
            personsService.create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson));
                    setNewName('');
                    setNewNumber('');
                    setSuccessMessage(`Added ${newName}`);
                    setTimeout(() => setSuccessMessage(null), 5000);
                })
                .catch(error => {
                    setErrorMessage(`Error adding ${newName}: ${error.error || error.message}`);
                    setTimeout(() => setErrorMessage(null), 5000);
                });
        }
    };

    const deletePerson = id => {
        const person = persons.find(p => p.id === id);
        if (window.confirm(`Delete ${person.name}?`)) {
            personsService.remove(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id));
                    setSuccessMessage(`Deleted ${person.name}`);
                    setTimeout(() => setSuccessMessage(null), 5000);
                })
                .catch(error => {
                    setErrorMessage(`Error deleting ${person.name}: ${error.message}`);
                    setTimeout(() => setErrorMessage(null), 5000);
                });
        }
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const personsToShow = persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={errorMessage} type="error" />
            <Notification message={successMessage} type="success" />
            <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
            <h2>Add a new person</h2>
            <PersonForm 
                addPerson={addPerson}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
        </div>
    );
};

export default App;
