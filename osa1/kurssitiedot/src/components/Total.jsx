import React from 'react';

const Total = ({ course }) => {
    let summa = 0;
     for (let i = 0; i < course.parts.length; i++) {
        summa += course.parts[i].exercises;
    }
    return (
        <p>Number of exercises {summa}</p>
    );
};

export default Total;
