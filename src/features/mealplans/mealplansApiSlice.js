import {
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const mealplansAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.updatedAt === b.updatedAt) ? 0 : a.updatedAt > b.updatedAt ? -1 : 1
})

const initialState = mealplansAdapter.getInitialState()

export const mealplansApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMealplans: builder.query({
      query: () => '/mealPlans',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        const loadedMealplans = responseData.map(mealplan => {
          mealplan.id = mealplan._id
          return mealplan
        });
        return mealplansAdapter.setAll(initialState, loadedMealplans)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Mealplan', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Mealplan', id }))
          ]
        } else return [{ type: 'Mealplan', id: 'LIST' }]
      }
    }),
  }),
})

export const {
  useGetMealplansQuery,
} = mealplansApiSlice

export const selectMealplansResult = mealplansApiSlice.endpoints.getMealplans.select()
const selectMealplansData = createSelector(
  selectMealplansResult,
  mealplansResult => mealplansResult.data
)

export const {
  selectAll: selectAllMealplans,
  selectById: selectMealplanById,
  selectIds: selectMealplanIds
} = mealplansAdapter.getSelectors(state => selectMealplansData(state) ?? initialState)