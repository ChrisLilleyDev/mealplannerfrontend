import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetInventoriesQuery } from './inventoriesApiSlice'
import { memo } from 'react'

function InventoryComp({ inventoryId }) {
    const { inventory } = useGetInventoriesQuery('inventoriesList', {
        selectFromResult: ({ data }) => ({
            inventory: data?.entities[inventoryId]
        })
    })
    const navigate = useNavigate()

    if (inventory) {
        const created = new Date(inventory.createdAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })
        const updated = new Date(inventory.updatedAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/inventories/${inventoryId}`)

        return (
            <tr className="table__row">
                <td className="table__cell note__status">
                    {inventory.active
                        ? <span className="note__status--completed">Active</span>
                        : <span className="note__status--open">Inactive</span>
                    }
                </td>
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>
                <td className="table__cell note__title">{inventory.name}</td>
                <td className="table__cell note__username">{inventory.user}</td>

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

export const Inventory = memo(InventoryComp)