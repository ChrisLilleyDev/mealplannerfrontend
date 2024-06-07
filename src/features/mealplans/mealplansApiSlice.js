import { apiSlice } from "../../app/api/apiSlice"
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const mealplansAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.updatedAt === b.updatedAt) ? 0 : a.updatedAt > b.updatedAt ? -1 : 1
})

const initialState = mealplansAdapter.getInitialState()

export const mealplansApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMealplans: builder.query({
            query: () => ({
                url: '/mealplans',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
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
        addNewMealplan: builder.mutation({
            query: initialMealplan => ({
                url: '/mealplans',
                method: 'POST',
                body: {
                    ...initialMealplan,
                }
            }),
            invalidatesTags: [
                { type: 'Mealplan', id: "LIST" }
            ]
        }),
        updateMealplan: builder.mutation({
            query: initialMealplan => ({
                url: '/mealplans',
                method: 'PATCH',
                body: {
                    ...initialMealplan,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Mealplan', id: arg.id }
            ]
        }),
        deleteMealplan: builder.mutation({
            query: ({ id }) => ({
                url: '/mealplans',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Mealplan', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetMealplansQuery,
    useAddNewMealplanMutation,
    useUpdateMealplanMutation,
    useDeleteMealplanMutation,
} = mealplansApiSlice

const selectMealplansResult = mealplansApiSlice.endpoints.getMealplans.select()
const selectMealplansData = createSelector(
    selectMealplansResult,
    mealplansResult => mealplansResult.data
)

export const {
    selectAll: selectAllMealplans,
    selectById: selectMealplanById,
    selectIds: selectMealplanIds
} = mealplansAdapter.getSelectors(state => selectMealplansData(state) ?? initialState)