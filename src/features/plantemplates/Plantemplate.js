import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetPlantemplatesQuery } from './plantemplatesApiSlice'
import { memo } from 'react'

function PlantemplateComp({ plantemplateId }) {
    const { plantemplate } = useGetPlantemplatesQuery('plantemplatesList', {
        selectFromResult: ({ data }) => ({
            plantemplate: data?.entities[plantemplateId]
        })
    })

    const navigate = useNavigate()

    if (plantemplate) {
        const created = new Date(plantemplate.createdAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })
        const updated = new Date(plantemplate.updatedAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/plantemplates/${plantemplateId}`)

        return (
            <tr className="table__row">
                <td className="table__cell note__status">
                    {plantemplate.active
                        ? <span className="note__status--completed">Active</span>
                        : <span className="note__status--open">Inactive</span>
                    }
                </td>
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>
                <td className="table__cell note__title">{plantemplate.name}</td>
                <td className="table__cell note__username">{plantemplate.user}</td>

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

export const Plantemplate = memo(PlantemplateComp)