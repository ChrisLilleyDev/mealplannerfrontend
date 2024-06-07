import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetMealsQuery } from './mealsApiSlice'
import { memo } from 'react'

function MealComp({ mealId }) {
    const { meal } = useGetMealsQuery('mealsList', {
        selectFromResult: ({ data }) => ({
            meal: data?.entities[mealId]
        })
    })

    const navigate = useNavigate()

    if (meal) {
        const created = new Date(meal.createdAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })
        const updated = new Date(meal.updatedAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/meals/${mealId}`)

        return (
            <tr className="table__row">
                <td className="table__cell note__status">
                    {meal.active
                        ? <span className="note__status--completed">Active</span>
                        : <span className="note__status--open">Inactive</span>
                    }
                </td>
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>
                <td className="table__cell note__title">{meal.name}</td>
                <td className="table__cell note__username">{meal.user}</td>

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

export const Meal = memo(MealComp)