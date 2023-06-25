import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectMealById } from './mealsApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditMealForm from './EditMealForm'

function EditMeal() {
    const { id } = useParams()

    const meal = useSelector(state => selectMealById(state, id))
    const users = useSelector(selectAllUsers)

    const content = meal && users ? <EditMealForm meal={meal} users={users} /> : <p>Loading...</p>

    return content
}
export default EditMeal