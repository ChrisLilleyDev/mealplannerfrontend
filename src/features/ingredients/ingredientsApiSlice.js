import { apiSlice } from "../../app/api/apiSlice"
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const ingredientsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.updatedAt === b.updatedAt) ? 0 : a.updatedAt > b.updatedAt ? -1 : 1
})

const initialState = ingredientsAdapter.getInitialState()

export const ingredientsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getIngredients: builder.query({
            query: () => ({
                url: '/ingredients',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedIngredients = responseData.map(ingredient => {
                    ingredient.id = ingredient._id
                    return ingredient
                });
                return ingredientsAdapter.setAll(initialState, loadedIngredients)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Ingredient', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Ingredient', id }))
                    ]
                } else return [{ type: 'Ingredient', id: 'LIST' }]
            }
        }),
        addNewIngredient: builder.mutation({
            query: initialIngredient => ({
                url: '/ingredients',
                method: 'POST',
                body: {
                    ...initialIngredient,
                }
            }),
            invalidatesTags: [
                { type: 'Ingredient', id: "LIST" }
            ]
        }),
        updateIngredient: builder.mutation({
            query: initialIngredient => ({
                url: '/ingredients',
                method: 'PATCH',
                body: {
                    ...initialIngredient,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Ingredient', id: arg.id }
            ]
        }),
        deleteIngredient: builder.mutation({
            query: ({ id, user }) => ({
                url: '/ingredients',
                method: 'DELETE',
                body: { id, user }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Ingredient', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetIngredientsQuery,
    useAddNewIngredientMutation,
    useUpdateIngredientMutation,
    useDeleteIngredientMutation,
} = ingredientsApiSlice

const selectIngredientsResult = ingredientsApiSlice.endpoints.getIngredients.select()
const selectIngredientsData = createSelector(
    selectIngredientsResult,
    ingredientsResult => ingredientsResult.data
)

export const {
    selectAll: selectAllIngredients,
    selectById: selectIngredientById,
    selectIds: selectIngredientIds
} = ingredientsAdapter.getSelectors(state => selectIngredientsData(state) ?? initialState)