import { useParams } from 'react-router-dom'
import { useGetMealplansQuery } from './mealplansApiSlice'
import { useGetPlantemplatesQuery } from '../plantemplates/plantemplatesApiSlice'
import { useGetConstraintsQuery } from '../constraints/constraintsApiSlice'
import { useGetInventoriesQuery } from '../inventories/inventoriesApiSlice'
import { useGetMealsQuery } from '../meals/mealsApiSlice'
import { EditMealplanForm } from './EditMealplanForm'

export function EditMealplan() {
    const { id } = useParams()

    const { mealplan } = useGetMealplansQuery('mealplansList', {
        selectFromResult: ({ data }) => ({
            mealplan: data?.entities[id]
        })
    })

    const {
        data: plantemplates,
        isLoading: isLoadingTemplates,
        isSuccess: isSuccessTemplates,
        isError: isErrorTemplates,
        error: errorTemplates
    } = useGetPlantemplatesQuery('plantemplatesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    const {
        data: constraints,
        isLoading: isLoadingConstraints,
        isSuccess: isSuccessConstraints,
        isError: isErrorConstraints,
        error: errorConstraints
    } = useGetConstraintsQuery('constraintsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    const {
        data: inventories,
        isLoading: isLoadingInventories,
        isSuccess: isSuccessInventories,
        isError: isErrorInventories,
        error: errorInventories
    } = useGetInventoriesQuery('inventoriesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    const {
        data: meals,
        isLoading: isLoadingMeals,
        isSuccess: isSuccessMeals,
        isError: isErrorMeals,
        error: errorMeals
    } = useGetMealsQuery('mealsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (!mealplan || isLoadingTemplates || isLoadingConstraints || isLoadingInventories || isLoadingMeals) content = <p>Loading...</p>

    if (isErrorTemplates || isErrorConstraints || isErrorInventories || isErrorMeals) {
        content = <p className="errmsg">
            {errorTemplates?.data?.message}
            {errorConstraints?.data?.message}
            {errorInventories?.data?.message}
            {errorMeals?.data?.message}
        </p>
    }

    if (isSuccessTemplates && isSuccessConstraints && isSuccessInventories && isSuccessMeals) {
        const allPlantemplates = Object.values(plantemplates.entities)
        const allConstraints = Object.values(constraints.entities)
        const allInventories = Object.values(inventories.entities)
        const allMeals = Object.values(meals.entities)

        const constraintsMap = new Map()
        const mealsMap = new Map()
        allConstraints.forEach(constraint => constraintsMap.set(constraint.id, constraint.name))
        allMeals.forEach(meal => mealsMap.set(meal.id, meal.name))

        content = <EditMealplanForm
            mealplan={mealplan}
            allPlantemplates={allPlantemplates}
            allConstraints={allConstraints}
            allInventories={allInventories}
            allMeals={allMeals}
            constraintsMap={constraintsMap}
            mealsMap={mealsMap}
        />
    }

    return content
}