import { useState, useEffect } from "react"
import { useUpdateIngredientMutation, useDeleteIngredientMutation } from "./ingredientsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

const EditIngredientForm = ({ ingredient, users }) => {

    const [updateIngredient, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateIngredientMutation()

    const [deleteIngredient, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteIngredientMutation()

    const navigate = useNavigate()

    const [userId, setUserId] = useState(ingredient.user)
    const [name, setName] = useState(ingredient.name)
    const [active, setActive] = useState(ingredient.active)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setUserId('')
            setName('')
            navigate('/dash/ingredients')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUserIdChanged = e => setUserId(e.target.value)
    const onNameChanged = e => setName(e.target.value)
    const onActiveChanged = e => setActive(prev => !prev)

    const canSave = [name, userId].every(Boolean) && !isLoading

    const onSaveIngredientClicked = async (e) => {
        if (canSave) {
            await updateIngredient({ id: ingredient.id, user: userId, name, active })
        }
    }

    const onDeleteIngredientClicked = async () => {
        await deleteIngredient({ id: ingredient.id, user: userId })
    }

    const created = new Date(ingredient.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(ingredient.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

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

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit {ingredient.name}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveIngredientClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteIngredientClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="ingredient-name">
                    Name:</label>
                <input
                    className={`form__input ${validNameClass}`}
                    id="ingredient-name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    value={name}
                    onChange={onNameChanged}
                />

                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="ingredient-active">
                            INGREDIENT ACTIVE:
                            <input
                                className="form__checkbox"
                                id="ingredient-active"
                                name="active"
                                type="checkbox"
                                checked={active}
                                onChange={onActiveChanged}
                            />
                        </label>

                        <label className="form__label form__checkbox-container" htmlFor="ingredient-username">
                            ASSIGNED TO:</label>
                        <select
                            id="ingredient-username"
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

export default EditIngredientForm