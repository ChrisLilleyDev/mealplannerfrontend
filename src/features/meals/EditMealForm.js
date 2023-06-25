import { useState, useEffect } from "react"
import { useUpdateMealMutation, useDeleteMealMutation } from "./mealsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

const EditMealForm = ({ meal, users }) => {

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

    const [userId, setUserId] = useState(meal.user)
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
            setDescription('')
            setUserId('')
            navigate('/dash/meals')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onActiveChanged = e => setActive(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [name, description, userId].every(Boolean) && !isLoading

    const onSaveMealClicked = async (e) => {
        if (canSave) {
            await updateMeal({ id: meal.id, user: userId, name, description, active })
        }
    }

    const onDeleteMealClicked = async () => {
        await deleteMeal({ id: meal.id })
    }

    const created = new Date(meal.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(meal.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validNameClass = !name ? "form__input--incomplete" : ''
    const validDescriptionClass = !description ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Meal #{meal.ticket}</h2>
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

                <label className="form__label" htmlFor="meal-description">
                    Description:</label>
                <textarea
                    className={`form__input form__input--text ${validDescriptionClass}`}
                    id="meal-description"
                    name="description"
                    value={description}
                    onChange={onDescriptionChanged}
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="meal-active">
                            WORK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="meal-active"
                                name="active"
                                type="checkbox"
                                checked={active}
                                onChange={onActiveChanged}
                            />
                        </label>

                        <label className="form__label form__checkbox-container" htmlFor="meal-username">
                            ASSIGNED TO:</label>
                        <select
                            id="meal-username"
                            name="username"
                            className="form__select"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
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

export default EditMealForm