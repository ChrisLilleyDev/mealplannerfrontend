import { Link } from 'react-router-dom'

function DashHeader() {
  const content = (
    <header className="DashHeader">
      <div className="DashHeader-Container">
        <Link to="/dash">
          <h1 className="DashHeader-Title">Meal Planner</h1>
        </Link>
        <nav className="DashHeader-Nav">
          {/* build later */}
        </nav>
      </div>
    </header>
  )
  return content
}

export default DashHeader