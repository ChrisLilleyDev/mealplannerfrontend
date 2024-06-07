import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { store } from '../../app/store'
import { constraintsApiSlice } from '../constraints/constraintsApiSlice'
import { ingredientsApiSlice } from '../ingredients/ingredientsApiSlice'
import { inventoriesApiSlice } from '../inventories/inventoriesApiSlice'
import { mealplansApiSlice } from '../mealplans/mealplansApiSlice'
import { mealsApiSlice } from '../meals/mealsApiSlice'
import { plantemplatesApiSlice } from '../plantemplates/plantemplatesApiSlice'
import { userApiSlice } from '../users/userApiSlice'

export function Prefetch() {
    useEffect(() => {
        store.dispatch(constraintsApiSlice.util.prefetch('getConstraints', 'constraintsList', { force: true }))
        store.dispatch(ingredientsApiSlice.util.prefetch('getIngredients', 'ingredientsList', { force: true }))
        store.dispatch(inventoriesApiSlice.util.prefetch('getInventories', 'inventoriesList', { force: true }))
        store.dispatch(mealplansApiSlice.util.prefetch('getMealplans', 'mealplansList', { force: true }))
        store.dispatch(mealsApiSlice.util.prefetch('getMeals', 'mealsList', { force: true }))
        store.dispatch(plantemplatesApiSlice.util.prefetch('getPlantemplates', 'plantemplatesList', { force: true }))
        store.dispatch(userApiSlice.util.prefetch('getUser', 'userList', { force: true }))
    }, [])

    return <Outlet />
}