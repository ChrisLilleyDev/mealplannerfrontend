import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewMealForm from './NewMealForm'

function NewMeal() {
    const users = useSelector(selectAllUsers)

    const content = users ? <NewMealForm users={users} /> : <p>Loading...</p>

    return content
}
export default NewMeal