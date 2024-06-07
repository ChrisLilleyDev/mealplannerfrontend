import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewPlantemplateMutation } from "./plantemplatesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

export function NewPlantemplateForm({ allConstraints, constraintsMap }) {

    const [addNewPlantemplate, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewPlantemplateMutation()

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [size, setSize] = useState(7)
    const [constraints, setConstraints] = useState([])

    useEffect(() => {
        if (isSuccess) {
            setName('')
            setConstraints([])
            setSize(7)
            navigate('/dash/plantemplates')
        }
    }, [isSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onRemoveConstraintClicked = id => setConstraints(constraints.filter(el => el !== id))
    const onAddConstraintClicked = id => { if (!constraints.includes(id)) setConstraints([...constraints, id]) }
    const onSizeChanged = e => setSize(e.target.value)

    const onSavePlantemplateClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewPlantemplate({ name, constraints, size })
        }
    }

    const constraintsList = constraints.map(id => {
        return (
            <li
                key={id}
                onClick={() => onRemoveConstraintClicked(id)}
            >{constraintsMap.get(id)}</li>
        )
    })

    const allConstraintsList = allConstraints.filter(el => !constraints.includes(el.id)).map(constraint => {
        return (
            <li
                key={constraint.id}
                onClick={() => onAddConstraintClicked(constraint.id)}
            >{constraint.name}</li>
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

            <form className="form" onSubmit={onSavePlantemplateClicked}>
                <div className="form__title-row">
                    <h2>New Plantemplate</h2>
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
                        <label className="form__label" htmlFor="plantemplate-constraints">
                            Constraints:</label>
                        <ul
                            id="plantemplate-constraints"
                            name="plantemplate-constraints"
                        >
                            {constraintsList}
                        </ul>
                    </div>

                    <div className="form__divider">
                        <label className="form__label" html="all-constraints">
                            Add:</label>
                        <ul
                            id="all-constraints"
                            name="all-constraints"
                        >
                            {allConstraintsList}
                        </ul>
                    </div>
                </div>

                <div className="form__row">
                    <label className="form__label" htmlFor="plantemplate-size">
                        Size:</label>
                    <select
                        id="plantemplate-size"
                        name="size"
                        className="form__select"
                        value={size}
                        onChange={onSizeChanged}
                    >
                        {numberOptions}
                    </select>
                </div>
            </form>
        </>
    )

    return content
}