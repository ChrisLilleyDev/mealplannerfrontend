import { Link } from 'react-router-dom'

function Welcome() {

  const date = new Date()
  const today = new Intl.DateTimeFormat('en-UK', {
    dateStyle: 'full',
    timeStyle: 'long'
  }).format(date)

  const content = (
    <section className="Welcome">
      <p>{today}</p>
      <h1>Welcome!</h1>
      <p><Link to="/dash/mealplans">View Meal Plans</Link></p>
      <p><Link to="/dash/meals">View Meals</Link></p>
      <p><Link to="/dash/users">View User Settings</Link></p>
    </section>
  )

  return content
}

export default Welcome