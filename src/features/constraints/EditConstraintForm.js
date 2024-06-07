import { useState, useEffect } from "react"
import { useUpdateConstraintMutation, useDeleteConstraintMutation } from "./constraintsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

export function EditConstraintForm({ constraint, allIngredients, ingredientsMap }) {

    const [updateConstraint, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateConstraintMutation()

    const [deleteConstraint, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteConstraintMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(constraint.name)
    const [active, setActive] = useState(constraint.active)
    const [ingredients, setIngredients] = useState(constraint.ingredients)
    const [maxOccurance, setMaxOccurance] = useState(constraint.maxOccurance)
    const [shorttermAdj, setShorttermAdj] = useState(constraint.shorttermAdj)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setName('')
            setIngredients([])
            setMaxOccurance(1)
            setShorttermAdj(3)
            navigate('/dash/constraints')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onActiveChanged = () => setActive(prev => !prev)
    const onRemoveIngredientClicked = id => setIngredients(ingredients.filter(el => el !== id))
    const onAddIngredientClicked = id => { if (!ingredients.includes(id)) setIngredients([...ingredients, id]) }
    const onMaxOccuranceChanged = e => setMaxOccurance(e.target.value)
    const onShorttermAdjChanged = e => setShorttermAdj(e.target.value)

    const onSaveConstraintClicked = async () => {
        if (canSave) {
            await updateConstraint({ id: constraint.id, name, active, ingredients, maxOccurance, shorttermAdj })
        }
    }

    const onDeleteConstraintClicked = async () => {
        await deleteConstraint({ id: constraint.id })
    }

    const created = new Date(constraint.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(constraint.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

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

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validNameClass = !name ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Constraint: {constraint.name}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveConstraintClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteConstraintClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="constraint-name">
                    Name:</label>
                <input
                    className={`form__input ${validNameClass}`}
                    id="constraint-name"
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

                <div className="form__row">
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="constraint-active">
                            Active:
                            <input
                                className="form__checkbox"
                                id="constraint-active"
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