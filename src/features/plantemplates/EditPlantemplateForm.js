import { useState, useEffect } from "react"
import { useUpdatePlantemplateMutation, useDeletePlantemplateMutation } from "./plantemplatesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

export function EditPlantemplateForm({ plantemplate, allConstraints, constraintsMap }) {

    const [updatePlantemplate, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdatePlantemplateMutation()

    const [deletePlantemplate, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeletePlantemplateMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(plantemplate.name)
    const [active, setActive] = useState(plantemplate.active)
    const [size, setSize] = useState(plantemplate.size)
    const [constraints, setConstraints] = useState(plantemplate.constraints)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setName('')
            setConstraints([])
            setSize(7)
            navigate('/dash/plantemplates')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onActiveChanged = () => setActive(prev => !prev)
    const onRemoveConstraintClicked = id => setConstraints(constraints.filter(el => el !== id))
    const onAddConstraintClicked = id => { if (!constraints.includes(id)) setConstraints([...constraints, id]) }
    const onSizeChanged = e => setSize(e.target.value)

    const onSavePlantemplateClicked = async () => {
        if (canSave) {
            await updatePlantemplate({ id: plantemplate.id, name, active, constraints, size })
        }
    }

    const onDeletePlantemplateClicked = async () => {
        await deletePlantemplate({ id: plantemplate.id })
    }

    const created = new Date(plantemplate.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(plantemplate.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

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

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validNameClass = !name ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Plantemplate: {plantemplate.name}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSavePlantemplateClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeletePlantemplateClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="plantemplate-name">
                    Name:</label>
                <input
                    className={`form__input ${validNameClass}`}
                    id="plantemplate-name"
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
                        size:</label>
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

                <div className="form__row">
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="plantemplate-active">
                            Active:
                            <input
                                className="form__checkbox"
                                id="plantemplate-active"
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