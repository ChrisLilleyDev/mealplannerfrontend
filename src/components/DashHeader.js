import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'

import { useSendLogoutMutation } from '../features/auth/authApiSlice'

const DASH_REGEX = /^\/dash(\/)?$/
const INGREDIENTS_REGEX = /^\/dash\/ingredients(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

export function DashHeader() {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    if (isLoading) return <p>Logging out...</p>

    if (isError) return <p>Error: {error?.data?.message}</p>

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !INGREDIENTS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const content = (
        <header className="dash-header">
            <div className={`dash-header__container ${dashClass}`}>
                <Link to="/dash">
                    <h1 className="dash-header__title">Meal Planner</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/* build later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )

    return content
}