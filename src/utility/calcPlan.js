export function calcPlan(size, inventory, constraints, meals) {
    const calcStartDate = new Date(new Date().toDateString())
    const calcEndDate = new Date(new Date(calcStartDate).setDate(calcStartDate.getDate() + size))
    let selections = []
    let calcContents = inventory.contents.map(obj => {
        return {
            ...obj,
            nextResetDate: new Date(obj.nextResetDate),
            nextUseDate: new Date(obj.nextUseDate)
        }
    })
    let cons = constraints.map(el => {
        const uses = el.maxOccurance
        const shorttermAdj = el.shorttermAdj
        const cooldown = (uses > 0) ? 0 : 1
        return {
            ingredients: [...el.ingredients],
            uses,
            shorttermAdj,
            cooldown
        }
    })
    for (let i = 0; i < size; i++) {
        const calculatedDay = new Date(new Date(calcStartDate).setDate(calcStartDate.getDate() + i))
        calcContents = calcContents.map(el => {
            if (el.nextResetDate > calculatedDay) return el
            else {
                const meal = meals.find(meal => meal.id === el.meal)
                return {
                    meal: meal.id,
                    remainingUses: meal.maxOccurance,
                    nextResetDate: new Date(new Date(calculatedDay).setDate(calculatedDay.getDate() + meal.timeReset)),
                    nextUseDate: calculatedDay
                }
            }
        })
        let consBlocking = cons.filter(el => el.cooldown > 0)
        const choice = calcContents.filter(el => !(el.nextUseDate > calculatedDay)).map(el => {
            const meal = meals.find(meal => meal.id === el.meal)
            return {
                ...el,
                ingredients: meal.ingredients,
                shorttermAdj: meal.shorttermAdj
            }
        }).filter(el => !el.ingredients.some(ingredient => consBlocking.some(con => con.ingredients.includes(ingredient))))
        if (choice.length > 0) {
            selections[i] = choice[Math.floor(Math.random() * choice.length)]
            const selectedMeal = calcContents.find(el => el.meal === selections[i].meal)
            if (selectedMeal.remainingUses > 1) {
                selectedMeal.remainingUses--
                selectedMeal.nextUseDate = new Date(new Date(calculatedDay).setDate(calculatedDay.getDate() + selections[i].shorttermAdj))
            } else {
                selectedMeal.remainingUses = 0
                selectedMeal.nextUseDate = selectedMeal.nextResetDate
            }
            cons.filter(el => el.cooldown === 0)
                .filter(el => el.ingredients.some(ingredient => selections[i].ingredients.includes(ingredient)))
                .forEach(el => {
                    el.uses--
                    el.cooldown = el.shorttermAdj
                })
        } else {
            selections[i] = { meal: 'blank' }
        }
        cons.filter(el => el.uses > 0 && el.cooldown > 0).forEach(el => el.cooldown--)
    }
    const calcCurrent = selections.map(el => el.meal)
    return { calcStartDate, calcEndDate, calcCurrent, calcContents }
}