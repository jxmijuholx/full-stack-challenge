import React from 'react';
import DeleteButton from './DeleteButton';

const Persons = ({ personsToShow, deletePerson }) => (
  <ul>
    {personsToShow.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        <DeleteButton id={person.id} name={person.name} onDelete={deletePerson} />
      </li>
    ))}
  </ul>
);

export default Persons;
