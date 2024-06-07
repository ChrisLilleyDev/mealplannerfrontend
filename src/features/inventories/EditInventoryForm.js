import { useState, useEffect } from "react"
import { useUpdateInventoryMutation, useDeleteInventoryMutation } from "./inventoriesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

export function EditInventoryForm({ inventory, allMeals, mealsMap }) {

    const [updateInventory, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateInventoryMutation()

    const [deleteInventory, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteInventoryMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(inventory.name)
    const [active, setActive] = useState(inventory.active)
    const [contents, setContents] = useState(inventory.contents)
    const [today] = useState(new Date(new Date().toDateString()))

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setName('')
            setContents([])
            navigate('/dash/inventories')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onActiveChanged = () => setActive(prev => !prev)
    const onRemoveMealClicked = id => setContents(contents.filter(el => el.meal !== id))
    const onAddMealClicked = meal => {
        if (!contents.some(el => el.meal === meal.id)) {
            setContents([...contents, {
                meal: meal.id,
                remainingUses: meal.maxOccurance,
                nextResetDate: new Date(new Date(today).setDate(today.getDate() + meal.timeReset)),
                nextUseDate: new Date(new Date(today).setDate(today.getDate() + meal.shorttermAdj))
            }])
        }
    }
    const onAddAllClicked = () => {
        const remainingMeals = allMeals.filter(meal => !contents.some(el => el.meal === meal.id)).map(meal => {
            return ({
                meal: meal.id,
                remainingUses: meal.maxOccurance,
                nextResetDate: new Date(new Date(today).setDate(today.getDate() + meal.timeReset)),
                nextUseDate: new Date(new Date(today).setDate(today.getDate() + meal.shorttermAdj))
            })
        })
        setContents([...contents, ...remainingMeals])
    }

    const onSaveInventoryClicked = async () => {
        if (canSave) {
            await updateInventory({ id: inventory.id, name, active, contents })
        }
    }

    const onDeleteInventoryClicked = async () => {
        await deleteInventory({ id: inventory.id })
    }

    const created = new Date(inventory.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(inventory.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const contentsList = contents.map(el => {
        return (
            <li
                key={el.meal}
                onClick={() => onRemoveMealClicked(el.meal)}
            >{mealsMap.get(el.meal)}</li>
        )
    })

    const allMealsList = allMeals.filter(meal => !contents.some(el => el.meal === meal.id)).map(meal => {
        return (
            <li
                key={meal.id}
                onClick={() => onAddMealClicked(meal)}
            >{meal.name}</li>
        )
    })

    const canSave = !!name && !isLoading

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validNameClass = !name ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Inventory: {inventory.name}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveInventoryClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteInventoryClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="inventory-name">
                    Name:</label>
                <input
                    className={`form__input ${validNameClass}`}
                    id="inventory-name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    value={name}
                    onChange={onNameChanged}
                />

                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label" htmlFor="inventory-meals">
                            Inventory:</label>
                        <ul
                            id="inventory-meals"
                            name="inventory-meals"
                        >
                            {contentsList}
                        </ul>
                    </div>

                    <div className="form__divider">
                        <label className="form__label" html="all-meals">
                            Add:</label>
                        <ul
                            id="all-meals"
                            name="all-meals"
                        >
                            {allMealsList}
                        </ul>
                    </div>

                    <div className="form__divider">
                        <label className="form__action">
                            <button
                                title="AddAll"
                                onClick={onAddAllClicked}
                            >
                                Add All
                            </button>
                        </label>
                    </div>
                </div>

                <div className="form__row">
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="inventory-active">
                            Active:
                            <input
                                className="form__checkbox"
                                id="inventory-active"
                                name="active"
                                type="checkbox"
                                checked={active}
                                onChange={onActiveChanged}
                            />
                        </label>
                    </div>
                </div>
            </form>
        </>
    )

    return content
}