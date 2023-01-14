import { Link } from 'react-router-dom'

function Public() {
  const content = (
    <section className="Public">
      <header>
        <h1>Meal Planner</h1>
      </header>
      <main>
        <p>The food you love, made easy</p>
      </main>
      <footer>
        <Link to="/login">Login</Link>
      </footer>
    </section>
  )
  
  return content
}

export default Public