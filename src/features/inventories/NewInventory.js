import { useGetMealsQuery } from '../meals/mealsApiSlice'
import { NewInventoryForm } from './NewInventoryForm'

export function NewInventory() {
    const {
        data: meals,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMealsQuery('mealsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const allMeals = Object.values(meals.entities)
        const mealsMap = new Map()
        allMeals.forEach(meal => mealsMap.set(meal.id, meal.name))

        content = <NewInventoryForm allMeals={allMeals} mealsMap={mealsMap} />
    }

    return content
}