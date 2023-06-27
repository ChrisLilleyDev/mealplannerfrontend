import { store } from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice'
import { ingredientsApiSlice } from '../ingredients/ingredientsApiSlice'
import { mealsApiSlice } from '../meals/mealsApiSlice'
import { mealplansApiSlice } from '../mealplans/mealplansApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
        const ingredients = store.dispatch(ingredientsApiSlice.endpoints.getUsers.initiate())
        const meals = store.dispatch(mealsApiSlice.endpoints.getMeals.initiate())
        const mealplans = store.dispatch(mealplansApiSlice.endpoints.getMeals.initiate())

        return () => {
            console.log('unsubscribing')
            users.unsubscribe()
            ingredients.unsubscribe()
            meals.unsubscribe()
            mealplans.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch