import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => (
  console.log(text, handleClick),
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({ text, value }) => (
  console.log(text, value),
  <>
  <table>
  <tbody>
  <tr>
  <td>{text}</td>
  <td>{value}</td>
</tr>
  </tbody>
  </table>
</>
)

const Statistics = ({good, neutral, bad}) =>{
  const all = good + neutral + bad
  console.log(all)
  const average = (good - bad) / all
  console.log(average)
  const positive = good / all * 100 + " %"
  console.log(positive)

  if (all === 0) {
    return <p>Give feedback by pressing the buttons</p>
  }

  return (
    <>
    <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="All" value={all} />
      <StatisticLine text="Average" value={average} />
      <StatisticLine text="Positive" value={positive} />
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <Header text="Give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="Bad" />
      <Header text="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App