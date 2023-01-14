import {
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const mealsAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.updatedAt === b.updatedAt) ? 0 : a.updatedAt > b.updatedAt ? -1 : 1
})

const initialState = mealsAdapter.getInitialState()

export const mealsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMeals: builder.query({
      query: () => '/meals',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        const loadedMeals = responseData.map(meal => {
          meal.id = meal._id
          return meal
        });
        return mealsAdapter.setAll(initialState, loadedMeals)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Meal', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Meal', id }))
          ]
        } else return [{ type: 'Meal', id: 'LIST' }]
      }
    }),
  }),
})

export const {
  useGetMealsQuery,
} = mealsApiSlice

export const selectMealsResult = mealsApiSlice.endpoints.getMeals.select()
const selectMealsData = createSelector(
  selectMealsResult,
  mealsResult => mealsResult.data
)

export const {
  selectAll: selectAllMeals,
  selectById: selectMealById,
  selectIds: selectMealIds
} = mealsAdapter.getSelectors(state => selectMealsData(state) ?? initialState)