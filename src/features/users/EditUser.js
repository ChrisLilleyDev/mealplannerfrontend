import { useParams } from 'react-router-dom'
import { useGetUserQuery } from './userApiSlice'
import { EditUserForm } from './EditUserForm'

export function EditUser() {
    const { id } = useParams()

    const { user } = useGetUserQuery('userList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        })
    })

    const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

    return content
}