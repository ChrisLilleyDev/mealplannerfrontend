import { useGetIngredientsQuery } from '../ingredients/ingredientsApiSlice'
import { NewMealForm } from './NewMealForm'

export function NewMeal() {
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

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const allIngredients = Object.values(ingredients.entities)
        const ingredientsMap = new Map()
        allIngredients.forEach(ingredient => ingredientsMap.set(ingredient.id, ingredient.name))

        content = <NewMealForm allIngredients={allIngredients} ingredientsMap={ingredientsMap} />
    }

    return content
}