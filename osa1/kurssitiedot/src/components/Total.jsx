import React from 'react';

const Total = ({ parts }) => {
    let summa = 0;
     for (let i = 0; i < parts.length; i++) {
        summa += parts[i].exercises;
    }
    return (
        <p>Number of exercises {summa}</p>
    );
};

export default Total;
