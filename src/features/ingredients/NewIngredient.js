import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewIngredientForm from './NewIngredientForm'

function NewIngredient() {
    const users = useSelector(selectAllUsers)

    const content = users ? <NewIngredientForm users={users} /> : <p>Loading...</p>

    return content
}
export default NewIngredient