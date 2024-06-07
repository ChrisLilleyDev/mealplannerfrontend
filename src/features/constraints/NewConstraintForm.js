import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewConstraintMutation } from "./constraintsApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

export function NewConstraintForm({ allIngredients, ingredientsMap }) {

    const [addNewConstraint, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewConstraintMutation()

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState([])
    const [maxOccurance, setMaxOccurance] = useState(1)
    const [shorttermAdj, setShorttermAdj] = useState(3)

    useEffect(() => {
        if (isSuccess) {
            setName('')
            setIngredients([])
            setMaxOccurance(1)
            setShorttermAdj(3)
            navigate('/dash/constraints')
        }
    }, [isSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onRemoveIngredientClicked = id => setIngredients(ingredients.filter(el => el !== id))
    const onAddIngredientClicked = id => { if (!ingredients.includes(id)) setIngredients([...ingredients, id]) }
    const onMaxOccuranceChanged = e => setMaxOccurance(e.target.value)
    const onShorttermAdjChanged = e => setShorttermAdj(e.target.value)

    const onSaveConstraintClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewConstraint({ name, ingredients, maxOccurance, shorttermAdj })
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

    const allIngredientsList = allIngredients.filter(el => !ingredients.includes(el.id)).map(ingredient => {
        return (
            <li
                key={ingredient.id}
                onClick={() => onAddIngredientClicked(ingredient.id)}
            >{ingredient.name}</li>
        )
    })

    const numberOptions = [0, 1, 2, 3, 4, 5, 6, 7].map(num => {
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

            <form className="form" onSubmit={onSaveConstraintClicked}>
                <div className="form__title-row">
                    <h2>New Constraint</h2>
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
                        <label className="form__label" htmlFor="constraint-ingredients">
                            Ingredients:</label>
                        <ul
                            id="constraint-ingredients"
                            name="constraint-ingredients"
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

                <div className="form__row">
                    <label className="form__label" htmlFor="constraint-max-occurance">
                        Max occurance:</label>
                    <select
                        id="constraint-max-occurance"
                        name="max-occurance"
                        className="form__select"
                        value={maxOccurance}
                        onChange={onMaxOccuranceChanged}
                    >
                        {numberOptions}
                    </select>
                </div>

                <div className="form__row">
                    <label className="form__label" htmlFor="constraint-shortterm-adj">
                        Frequency limit:</label>
                    <select
                        id="constraint-shortterm-adj"
                        name="shortterm-adj"
                        className="form__select"
                        value={shorttermAdj}
                        onChange={onShorttermAdjChanged}
                    >
                        {numberOptions}
                    </select>
                </div>
            </form>
        </>
    )

    return content
}