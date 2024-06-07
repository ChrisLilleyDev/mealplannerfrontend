import { useSelector } from "react-redux"
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from "jwt-decode"

export function useAuth() {
    const token = useSelector(selectCurrentToken)
    let isModerator = false
    let isAdmin = false
    let status = "User"

    if (token) {
        const decoded = jwtDecode(token)
        const { user, username, roles } = decoded.UserInfo

        isModerator = roles.includes('Moderator')
        isAdmin = roles.includes('Admin')

        if (isModerator) status = "Moderator"
        if (isAdmin) status = "Admin"

        return { user, username, roles, isModerator, isAdmin, status }
    }

    return { user: '', username: '', roles: [], isModerator, isAdmin, status }
}