import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewMealMutation } from "./mealsApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

export function NewMealForm({ allIngredients, ingredientsMap }) {

    const [addNewMeal, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewMealMutation()

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState([])
    const [description, setDescription] = useState('')
    const [maxOccurance, setMaxOccurance] = useState(1)
    const [timeReset, setTimeReset] = useState(7)
    const [shorttermAdj, setShorttermAdj] = useState(3)

    useEffect(() => {
        if (isSuccess) {
            setName('')
            setIngredients([])
            setDescription('')
            setMaxOccurance(1)
            setTimeReset(7)
            setShorttermAdj(3)
            navigate('/dash/meals')
        }
    }, [isSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onRemoveIngredientClicked = id => setIngredients(ingredients.filter(el => el !== id))
    const onAddIngredientClicked = id => { if (!ingredients.includes(id)) setIngredients([...ingredients, id]) }
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onMaxOccuranceChanged = e => setMaxOccurance(e.target.value)
    const onTimeResetChanged = e => setTimeReset(e.target.value)
    const onShorttermAdjChanged = e => setShorttermAdj(e.target.value)

    const onSaveMealClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewMeal({ name, ingredients, description, maxOccurance, timeReset, shorttermAdj })
        }
    }

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

    const errClass = isError ? "errmsg" : "offscreen"
    const validNameClass = !name ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveMealClicked}>
                <div className="form__title-row">
                    <h2>New Meal</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
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

                <label className="form__label" htmlFor="description">
                    Description:</label>
                <textarea
                    className="form__input form__input--text"
                    id="description"
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
            </form>
        </>
    )

    return content
}