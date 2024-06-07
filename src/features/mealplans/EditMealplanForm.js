import { useState, useEffect } from "react"
import { useUpdateMealplanMutation, useDeleteMealplanMutation } from "./mealplansApiSlice"
import { useNavigate } from "react-router-dom"
import { calcPlan } from "../../utility/calcPlan"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

export function EditMealplanForm({ mealplan, allPlantemplates, allConstraints, allInventories, allMeals, constraintsMap, mealsMap }) {

    const [updateMealplan, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateMealplanMutation()

    const [deleteMealplan, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteMealplanMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(mealplan.name)
    const [active, setActive] = useState(mealplan.active)
    const [size, setSize] = useState(mealplan.size)
    const [constraints, setConstraints] = useState(mealplan.constraints)
    const [inventory, setInventory] = useState(mealplan.inventory)
    const [updatedContents, setUpdatedContents] = useState([])
    const [startDate, setStartDate] = useState(new Date(mealplan.startDate))
    const [endDate, setEndDate] = useState(new Date(mealplan.endDate))
    const [current, setCurrent] = useState(mealplan.current)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setName('')
            setSize(7)
            setConstraints([])
            setInventory()
            setUpdatedContents([])
            setStartDate()
            setEndDate()
            setCurrent([])
            navigate('/dash/mealplans')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const resetPlan = () => {
        setUpdatedContents([])
        setStartDate()
        setEndDate()
        setCurrent([])
    }
    const onNameChanged = e => setName(e.target.value)
    const onActiveChanged = () => setActive(prev => !prev)
    const onAddPlantemplateClicked = plantemplate => {
        setSize(plantemplate.size)
        setConstraints(plantemplate.constraints)
        resetPlan()
    }
    const onSizeChanged = e => {
        setSize(e.target.value)
        resetPlan()
    }
    const onRemoveConstraintClicked = id => {
        setConstraints(constraints.filter(el => el !== id))
        resetPlan()
    }
    const onAddInventoryClicked = id => {
        if (id === inventory) return
        setInventory(id)
        resetPlan()
    }
    const onGenerateClicked = () => {
        if (!canGenerate) return
        const calcInventory = allInventories.find(el => el.id === inventory)
        const calcConstraints = allConstraints.filter(el => constraints.includes(el.id))
        const { calcStartDate, calcEndDate, calcCurrent, calcContents } = calcPlan(size, calcInventory, calcConstraints, allMeals)
        setStartDate(calcStartDate)
        setEndDate(calcEndDate)
        setCurrent(calcCurrent)
        setUpdatedContents(calcContents)
    }
    const onSaveMealplanClicked = async () => {
        if (!canSave) return
        await updateMealplan({ id: mealplan.id, name, active, size, constraints, inventory, updatedContents, startDate, endDate, current })
    }
    const onDeleteMealplanClicked = async () => {
        await deleteMealplan({ id: mealplan.id })
    }

    const created = new Date(mealplan.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(mealplan.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const numberOptions = [1, 2, 3, 4, 5, 6, 7].map(num => {
        return (
            <option
                key={num}
                value={num}
            >{num}</option>
        )
    })

    const constraintsList = constraints.map(id => {
        return (
            <li
                key={id}
                onClick={() => onRemoveConstraintClicked(id)}
            >{constraintsMap.get(id)}</li>
        )
    })

    const inventoryList = allInventories.find(el => el.id === inventory)?.contents.map(el => {
        return (
            <li
                key={el.meal}
            >{mealsMap.get(el.meal)}</li>
        )
    })

    const currentList = current.map((id, index) => {
        return (
            <li
                key={index}
            >{id === 'blank' ? 'blank' : mealsMap.get(id)}</li>
        )
    })

    const allPlantemplatesList = allPlantemplates.map(plantemplate => {
        return (
            <li
                key={plantemplate.id}
                onClick={() => onAddPlantemplateClicked(plantemplate)}
            >{plantemplate.name}</li>
        )
    })

    const allInventoriesList = allInventories.map(inventory => {
        return (
            <li
                key={inventory.id}
                onClick={() => onAddInventoryClicked(inventory.id)}
            >{inventory.name}</li>
        )
    })

    const canSave = !isLoading && !!name && !!size && !!inventory && !!startDate && !!endDate && !!current
    const canGenerate = typeof inventory === 'undefined' ? false : true

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validNameClass = !name ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Mealplan: {mealplan.name}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveMealplanClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteMealplanClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
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
                        <div className="form__row">
                            <label className="form__label" htmlFor="mealplan-size">
                                Size:</label>
                            <select
                                id="mealplan-size"
                                name="size"
                                className="form__select"
                                value={size}
                                onChange={onSizeChanged}
                            >
                                {numberOptions}
                            </select>
                        </div>

                        <label className="form__label" htmlFor="mealplan-constraints">
                            Constraints:</label>
                        <ul
                            id="mealplan-constraints"
                            name="mealplan-constraints"
                        >
                            {constraintsList}
                        </ul>
                    </div>

                    <div className="form__divider">
                        <label className="form__label" html="all-plantemplates">
                            Plan Templates:</label>
                        <ul
                            id="all-plantemplates"
                            name="all-plantemplates"
                        >
                            {allPlantemplatesList}
                        </ul>
                    </div>
                </div>

                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label" htmlFor="mealplan-inventory">
                            Inventory:</label>
                        <ul
                            id="mealplan-inventory"
                            name="mealplan-inventory"
                        >
                            {inventoryList}
                        </ul>
                    </div>

                    <div className="form__divider">
                        <label className="form__label" html="all-inventories">
                            Inventories:</label>
                        <ul
                            id="all-inventories"
                            name="all-inventories"
                        >
                            {allInventoriesList}
                        </ul>
                    </div>
                </div>

                <label className="form_label" htmlFor="mealplan-startdate">
                    Start Date: {typeof startDate !== 'undefined' ? startDate.toDateString() : ''}
                </label>
                <label className="form__label" htmlFor="mealplan-enddate">
                    End Date: {typeof endDate !== 'undefined' ? endDate.toDateString() : ''}
                </label>

                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label" htmlFor="mealplan-current">
                            Current:</label>
                        <ul
                            id="mealplan-current"
                            name="mealplan-current"
                        >
                            {currentList}
                        </ul>
                    </div>

                    <div className="form_divider">
                        <button
                            title="Generate"
                            onClick={onGenerateClicked}
                            disabled={!canGenerate}
                        >
                            Generate
                        </button>
                    </div>
                </div>

                <div className="form__row">
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="mealplan-active">
                            Active:
                            <input
                                className="form__checkbox"
                                id="mealplan-active"
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