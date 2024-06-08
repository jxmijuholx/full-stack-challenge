
const Content = ({ course }) => {
    return (
    <>
    {course.parts.map(part => <p key={part.name}>{part.name} {part.exercises}</p>)}
    </>
    );
};

export default Content