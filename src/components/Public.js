import { Link } from 'react-router-dom'

export function Public() {
  const content = (
    <section className="public">
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