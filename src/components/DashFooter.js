import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from "react-router-dom"

function DashFooter() {

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onGoHomeClicked = () => navigate('/dash')

  let goHomeButton = null
  if (pathname !== '/dash') {
    goHomeButton = (
      <button
        className="DashFooter-Button IconButton"
        title="Home"
        onClick={onGoHomeClicked}
      >

      </button>
    )
  }

  const content = (
    <footer className="DashFooter">
      {goHomeButton}
      <p>Current User:</p>
      <p>Status:</p>
    </footer>
  )

  return content
}

export default DashFooter