import { useState, useEffect } from "react"
import { useUpdateMealMutation, useDeleteMealMutation } from "./mealsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

export function EditMealForm({ meal, allIngredients, ingredientsMap }) {

    const [updateMeal, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateMealMutation()

    const [deleteMeal, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteMealMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(meal.name)
    const [active, setActive] = useState(meal.active)
    const [ingredients, setIngredients] = useState(meal.ingredients)
    const [description, setDescription] = useState(meal.description)
    const [maxOccurance, setMaxOccurance] = useState(meal.maxOccurance)
    const [timeReset, setTimeReset] = useState(meal.timeReset)
    const [shorttermAdj, setShorttermAdj] = useState(meal.shorttermAdj)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setName('')
            setIngredients([])
            setDescription('')
            setMaxOccurance(1)
            setTimeReset(7)
            setShorttermAdj(3)
            navigate('/dash/meals')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onActiveChanged = () => setActive(prev => !prev)
    const onRemoveIngredientClicked = id => setIngredients(ingredients.filter(el => el !== id))
    const onAddIngredientClicked = id => { if (!ingredients.includes(id)) setIngredients([...ingredients, id]) }
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onMaxOccuranceChanged = e => setMaxOccurance(e.target.value)
    const onTimeResetChanged = e => setTimeReset(e.target.value)
    const onShorttermAdjChanged = e => setShorttermAdj(e.target.value)

    const onSaveMealClicked = async () => {
        if (canSave) {
            await updateMeal({ id: meal.id, name, active, ingredients, description, maxOccurance, timeReset, shorttermAdj })
        }
    }

    const onDeleteMealClicked = async () => {
        await deleteMeal({ id: meal.id })
    }

    const created = new Date(meal.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(meal.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const ingredientsList = ingredients.map(id => {
        return (
            <li
                key={id}
                onClick={() => onRemoveIngredientClicked(id)}
            >{ingredientsMap.get(id)}</li>
        )
    })

    const allIngredientsList = allIngredients.map(ingredient => {
        return (
            <li
                key={ingredient.id}
                onClick={() => onAddIngredientClicked(ingredient.id)}
            >{ingredient.name}</li>
        )
    })

    const numberOptions = [1, 2, 3, 4, 5, 6, 7].map(num => {
        return (
            <option
                key={num}
                value={num}
            >{num}</option>
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
                    <h2>Edit Meal: {meal.name}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveMealClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteMealClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="meal-name">
                    Name:</label>
                <input
                    className={`form__input ${validNameClass}`}
                    id="meal-name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    value={name}
                    onChange={onNameChanged}
                />

                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label" htmlFor="meal-ingredients">
                            Ingredients:</label>
                        <ul
                            id="meal-ingredients"
                            name="meal-ingredients"
                        >
                            {ingredientsList}
                        </ul>
                    </div>

                    <div className="form__divider">
                        <label className="form__label" html="all-ingredients">
                            Add:</label>
                        <ul
                            id="all-ingredients"
                            name="all-ingredients"
                        >
                            {allIngredientsList}
                        </ul>
                    </div>
                </div>

                <label className="form__label" htmlFor="meal-description">
                    Description:</label>
                <textarea
                    className="form__input form__input--text"
                    id="meal-description"
                    name="description"
                    value={description}
                    onChange={onDescriptionChanged}
                />

                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label" htmlFor="meal-max-occurance">
                            Max occurance:</label>
                        <select
                            id="meal-max-occurance"
                            name="max-occurance"
                            className="form__select"
                            value={maxOccurance}
                            onChange={onMaxOccuranceChanged}
                        >
                            {numberOptions}
                        </select>
                    </div>

                    <div className="form__divider">
                        <label className="form__label" htmlFor="meal-time-reset">
                            Time reset:</label>
                        <select
                            id="meal-time-reset"
                            name="time-reset"
                            className="form__select"
                            value={timeReset}
                            onChange={onTimeResetChanged}
                        >
                            {numberOptions}
                        </select>
                    </div>

                    <div className="form__divider">
                        <label className="form__label" htmlFor="meal-shortterm-adj">
                            Frequency limit:</label>
                        <select
                            id="meal-shortterm-adj"
                            name="shortterm-adj"
                            className="form__select"
                            value={shorttermAdj}
                            onChange={onShorttermAdjChanged}
                        >
                            {numberOptions}
                        </select>
                    </div>
                </div>

                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="meal-active">
                            Active:
                            <input
                                className="form__checkbox"
                                id="meal-active"
                                name="active"
                                type="checkbox"
                                checked={active}
                                onChange={onActiveChanged}
                            />
                        </label>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )

    return content
}