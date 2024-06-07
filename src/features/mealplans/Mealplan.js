import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetMealplansQuery } from './mealplansApiSlice'
import { memo } from 'react'

function MealplanComp({ mealplanId }) {
    const { mealplan } = useGetMealplansQuery('mealplansList', {
        selectFromResult: ({ data }) => ({
            mealplan: data?.entities[mealplanId]
        })
    })

    const navigate = useNavigate()

    if (mealplan) {
        const created = new Date(mealplan.createdAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })
        const updated = new Date(mealplan.updatedAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/mealplans/${mealplanId}`)

        return (
            <tr className="table__row">
                <td className="table__cell note__status">
                    {mealplan.active
                        ? <span className="note__status--completed">Active</span>
                        : <span className="note__status--open">Inactive</span>
                    }
                </td>
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>
                <td className="table__cell note__title">{mealplan.name}</td>
                <td className="table__cell note__username">{mealplan.user}</td>

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

export const Mealplan = memo(MealplanComp)