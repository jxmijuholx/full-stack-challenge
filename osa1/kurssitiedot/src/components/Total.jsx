import React from 'react';

const Total = ({ part1, part2, part3 }) => {
    const summa = part1.exercises + part2.exercises + part3.exercises;
    return (
        <p>Number of exercises {summa}</p>
    );
};

export default Total;
