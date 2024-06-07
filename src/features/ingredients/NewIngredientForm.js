import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewIngredientMutation } from "./ingredientsApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

export function NewIngredientForm() {

    const [addNewIngredient, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewIngredientMutation()

    const navigate = useNavigate()

    const [name, setName] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setName('')
            navigate('/dash/ingredients')
        }
    }, [isSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)

    const canSave = !!name && !isLoading

    const onSaveIngredientClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewIngredient({ name })
        }
    }

    // const options = users.map(user => {
    //     return (
    //         <option
    //             key={user.id}
    //             value={user.id}
    //         > {user.username}</option >
    //     )
    // })

    const errClass = isError ? "errmsg" : "offscreen"
    const validNameClass = !name ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveIngredientClicked}>
                <div className="form__title-row">
                    <h2>New Ingredient</h2>
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

                {/* <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:</label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select> */}

            </form>
        </>
    )

    return content
}