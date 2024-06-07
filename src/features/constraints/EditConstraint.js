import { useParams } from 'react-router-dom'
import { useGetConstraintsQuery } from './constraintsApiSlice'
import { useGetIngredientsQuery } from '../ingredients/ingredientsApiSlice'
import { EditConstraintForm } from './EditConstraintForm'

export function EditConstraint() {
    const { id } = useParams()

    const { constraint } = useGetConstraintsQuery('constraintsList', {
        selectFromResult: ({ data }) => ({
            constraint: data?.entities[id]
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

    if (!constraint || isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const allIngredients = Object.values(ingredients.entities)
        const ingredientsMap = new Map()
        allIngredients.forEach(ingredient => ingredientsMap.set(ingredient.id, ingredient.name))

        content = <EditConstraintForm constraint={constraint} allIngredients={allIngredients} ingredientsMap={ingredientsMap} />
    }

    return content
}