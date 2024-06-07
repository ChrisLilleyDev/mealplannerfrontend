import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewMealplanMutation } from "./mealplansApiSlice"
import { calcPlan } from "../../utility/calcPlan"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

export function NewMealplanForm({ allPlantemplates, allConstraints, allInventories, allMeals, constraintsMap, mealsMap }) {

    const [addNewMealplan, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewMealplanMutation()

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [size, setSize] = useState(7)
    const [constraints, setConstraints] = useState([])
    const [inventory, setInventory] = useState()
    const [updatedContents, setUpdatedContents] = useState([])
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [current, setCurrent] = useState([])

    useEffect(() => {
        if (isSuccess) {
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
    }, [isSuccess, navigate])

    const resetPlan = () => {
        setUpdatedContents([])
        setStartDate()
        setEndDate()
        setCurrent([])
    }
    const onNameChanged = e => setName(e.target.value)
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
        await addNewMealplan({ name, size, constraints, inventory, updatedContents, startDate, endDate, current })
    }

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

    const errClass = isError ? "errmsg" : "offscreen"
    const validNameClass = !name ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>New Mealplan</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveMealplanClicked}
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
            </form>
        </>
    )

    return content
}