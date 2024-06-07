import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetConstraintsQuery } from './constraintsApiSlice'
import { memo } from 'react'

function ConstraintComp({ constraintId }) {
    const { constraint } = useGetConstraintsQuery('constraintsList', {
        selectFromResult: ({ data }) => ({
            constraint: data?.entities[constraintId]
        })
    })

    const navigate = useNavigate()

    if (constraint) {
        const created = new Date(constraint.createdAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })
        const updated = new Date(constraint.updatedAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/constraints/${constraintId}`)

        return (
            <tr className="table__row">
                <td className="table__cell note__status">
                    {constraint.active
                        ? <span className="note__status--completed">Active</span>
                        : <span className="note__status--open">Inactive</span>
                    }
                </td>
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>
                <td className="table__cell note__title">{constraint.name}</td>
                <td className="table__cell note__username">{constraint.user}</td>

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

export const Constraint = memo(ConstraintComp)