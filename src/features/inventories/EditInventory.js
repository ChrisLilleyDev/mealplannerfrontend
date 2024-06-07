import { useParams } from 'react-router-dom'
import { useGetInventoriesQuery } from './inventoriesApiSlice'
import { useGetMealsQuery } from '../meals/mealsApiSlice'
import { EditInventoryForm } from './EditInventoryForm'

export function EditInventory() {
    const { id } = useParams()

    const { inventory } = useGetInventoriesQuery('inventoriesList', {
        selectFromResult: ({ data }) => ({
            inventory: data?.entities[id]
        })
    })

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

    if (!inventory || isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const allMeals = Object.values(meals.entities)
        const mealsMap = new Map()
        allMeals.forEach(meal => mealsMap.set(meal.id, meal.name))

        content = <EditInventoryForm inventory={inventory} allMeals={allMeals} mealsMap={mealsMap} />
    }

    return content
}