import { useParams } from 'react-router-dom'
import { useGetIngredientsQuery } from './ingredientsApiSlice'
import { EditIngredientForm } from './EditIngredientForm'

export function EditIngredient() {
    const { id } = useParams()

    const { ingredient } = useGetIngredientsQuery('ingredientsList', {
        selectFromResult: ({ data }) => ({
            ingredient: data?.entities[id]
        })
    })

    if (!ingredient) return <p>Loading...</p>

    const content = <EditIngredientForm ingredient={ingredient} />

    return content
}