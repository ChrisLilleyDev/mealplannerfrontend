import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectIngredientById } from './ingredientsApiSlice'

function Ingredient({ ingredientId }) {

  const ingredient = useSelector(state => selectIngredientById(state, ingredientId))

  const navigate = useNavigate()

  if (ingredient) {
    const created = new Date(ingredient.createdAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })
    const updated = new Date(ingredient.updatedAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })

    const handleEdit = () => navigate(`/dash/ingredients/${ingredientId}`)

    return (
      <tr className="table__row">
        <td className="table__cell note__status">
          {ingredient.active
            ? <span className="note__status--completed">Active</span>
            : <span className="note__status--open">Inactive</span>
          }
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{ingredient.name}</td>
        <td className="table__cell note__username">{ingredient.user}</td>

        <td className="table__cell">
          <button
            className="icon-button table__button"
            onClick={handleEdit}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    )

  } else return null
}

export default Ingredient