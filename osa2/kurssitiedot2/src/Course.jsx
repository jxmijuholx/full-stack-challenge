
const Header = (props) => {
    return (
        <>
        <h1>{props.course.name}</h1>
        </>
    )
}

const Content = ({ course }) => {
    return (
    <>
    {course.parts.map(part => <p key={part.name}>{part.name} {part.exercises}</p>)}
    </>
    );
};

const Total = ({ course }) => {
    const summa = course.parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <b><p>Total of {summa} excercises</p></b>
    );
};

const Course = ({ course }) => {
    return (
        <>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
        </>
    );
}

export default Course;