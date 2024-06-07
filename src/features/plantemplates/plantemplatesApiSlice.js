import { apiSlice } from "../../app/api/apiSlice"
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const plantemplatesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.updatedAt === b.updatedAt) ? 0 : a.updatedAt > b.updatedAt ? -1 : 1
})

const initialState = plantemplatesAdapter.getInitialState()

export const plantemplatesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPlantemplates: builder.query({
            query: () => ({
                url: '/plantemplates',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedPlantemplates = responseData.map(plantemplate => {
                    plantemplate.id = plantemplate._id
                    return plantemplate
                });
                return plantemplatesAdapter.setAll(initialState, loadedPlantemplates)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Plantemplate', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Plantemplate', id }))
                    ]
                } else return [{ type: 'Plantemplate', id: 'LIST' }]
            }
        }),
        addNewPlantemplate: builder.mutation({
            query: initialPlantemplate => ({
                url: '/plantemplates',
                method: 'POST',
                body: {
                    ...initialPlantemplate,
                }
            }),
            invalidatesTags: [
                { type: 'Plantemplate', id: "LIST" }
            ]
        }),
        updatePlantemplate: builder.mutation({
            query: initialPlantemplate => ({
                url: '/plantemplates',
                method: 'PATCH',
                body: {
                    ...initialPlantemplate,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Plantemplate', id: arg.id }
            ]
        }),
        deletePlantemplate: builder.mutation({
            query: ({ id }) => ({
                url: '/plantemplates',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Plantemplate', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetPlantemplatesQuery,
    useAddNewPlantemplateMutation,
    useUpdatePlantemplateMutation,
    useDeletePlantemplateMutation,
} = plantemplatesApiSlice

const selectPlantemplatesResult = plantemplatesApiSlice.endpoints.getPlantemplates.select()
const selectPlantemplatesData = createSelector(
    selectPlantemplatesResult,
    plantemplatesResult => plantemplatesResult.data
)

export const {
    selectAll: selectAllPlantemplates,
    selectById: selectPlantemplateById,
    selectIds: selectPlantemplateIds
} = plantemplatesAdapter.getSelectors(state => selectPlantemplatesData(state) ?? initialState)