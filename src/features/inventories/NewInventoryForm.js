import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewInventoryMutation } from "./inventoriesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

export function NewInventoryForm({ allMeals, mealsMap }) {

    const [addNewInventory, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewInventoryMutation()

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [contents, setContents] = useState([])
    const [today] = useState(new Date(new Date().toDateString()))

    useEffect(() => {
        if (isSuccess) {
            setName('')
            setContents([])
            navigate('/dash/inventories')
        }
    }, [isSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onRemoveMealClicked = id => setContents(contents.filter(el => el.meal !== id))
    const onAddMealClicked = meal => {
        if (!contents.some(el => el.meal === meal.id)) {
            setContents([...contents, {
                meal: meal.id,
                remainingUses: meal.maxOccurance,
                nextResetDate: new Date(new Date(today).setDate(today.getDate() + meal.timeReset)),
                nextUseDate: today
            }])
        }
    }
    const onAddAllClicked = () => {
        const remainingMeals = allMeals.filter(meal => !contents.some(el => el.meal === meal.id)).map(meal => {
            return ({
                meal: meal.id,
                remainingUses: meal.maxOccurance,
                nextResetDate: new Date(new Date(today).setDate(today.getDate() + meal.timeReset)),
                nextUseDate: today
            })
        })
        setContents([...contents, ...remainingMeals])
    }

    const onSaveInventoryClicked = async () => {
        if (canSave) {
            await addNewInventory({ name, contents })
        }
    }

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

    const errClass = isError ? "errmsg" : "offscreen"
    const validNameClass = !name ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>New Inventory</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveInventoryClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="name">
                    Name:</label>
                <input
                    className={`form__input ${validNameClass}`}
                    id="name"
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
            </form>
        </>
    )

    return content
}