import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIngredientById } from './ingredientsApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditIngredientForm from './EditIngredientForm'

function EditIngredient() {
    const { id } = useParams()

    const ingredient = useSelector(state => selectIngredientById(state, id))
    const users = useSelector(selectAllUsers)

    const content = ingredient && users ? <EditIngredientForm ingredient={ingredient} users={users} /> : <p>Loading...</p>

    return content
}
export default EditIngredient