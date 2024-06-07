import { useParams } from 'react-router-dom'
import { useGetMealsQuery } from './mealsApiSlice'
import { useGetIngredientsQuery } from '../ingredients/ingredientsApiSlice'
import { EditMealForm } from './EditMealForm'

export function EditMeal() {
    const { id } = useParams()

    const { meal } = useGetMealsQuery('mealsList', {
        selectFromResult: ({ data }) => ({
            meal: data?.entities[id]
        })
    })

    const {
        data: ingredients,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetIngredientsQuery('ingredientsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (!meal || isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const allIngredients = Object.values(ingredients.entities)
        const ingredientsMap = new Map()
        allIngredients.forEach(ingredient => ingredientsMap.set(ingredient.id, ingredient.name))

        content = <EditMealForm meal={meal} allIngredients={allIngredients} ingredientsMap={ingredientsMap} />
    }

    return content
}