import React from 'react';

const DeleteButton = ({ id, name, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete ${name}?`)) {
      onDelete(id);
    }
  };

  return <button onClick={handleDelete}>delete</button>;
};

export default DeleteButton;
