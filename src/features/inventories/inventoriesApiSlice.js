import { apiSlice } from "../../app/api/apiSlice"
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const inventoriesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.updatedAt === b.updatedAt) ? 0 : a.updatedAt > b.updatedAt ? -1 : 1
})

const initialState = inventoriesAdapter.getInitialState()

export const inventoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getInventories: builder.query({
            query: () => ({
                url: '/inventories',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedInventories = responseData.map(inventory => {
                    inventory.id = inventory._id
                    return inventory
                });
                return inventoriesAdapter.setAll(initialState, loadedInventories)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Inventory', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Inventory', id }))
                    ]
                } else return [{ type: 'Inventory', id: 'LIST' }]
            }
        }),
        addNewInventory: builder.mutation({
            query: initialInventory => ({
                url: '/inventories',
                method: 'POST',
                body: {
                    ...initialInventory,
                }
            }),
            invalidatesTags: [
                { type: 'Inventory', id: "LIST" }
            ]
        }),
        updateInventory: builder.mutation({
            query: initialInventory => ({
                url: '/inventories',
                method: 'PATCH',
                body: {
                    ...initialInventory,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Inventory', id: arg.id }
            ]
        }),
        deleteInventory: builder.mutation({
            query: ({ id }) => ({
                url: '/inventories',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Inventory', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetInventoriesQuery,
    useAddNewInventoryMutation,
    useUpdateInventoryMutation,
    useDeleteInventoryMutation,
} = inventoriesApiSlice

const selectInventoriesResult = inventoriesApiSlice.endpoints.getInventories.select()
const selectInventoriesData = createSelector(
    selectInventoriesResult,
    inventoriesResult => inventoriesResult.data
)

export const {
    selectAll: selectAllInventories,
    selectById: selectInventoryById,
    selectIds: selectInventoryIds
} = inventoriesAdapter.getSelectors(state => selectInventoriesData(state) ?? initialState)