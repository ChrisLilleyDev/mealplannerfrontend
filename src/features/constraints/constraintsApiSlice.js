import { apiSlice } from "../../app/api/apiSlice"
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const constraintsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.updatedAt === b.updatedAt) ? 0 : a.updatedAt > b.updatedAt ? -1 : 1
})

const initialState = constraintsAdapter.getInitialState()

export const constraintsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getConstraints: builder.query({
            query: () => ({
                url: '/constraints',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedConstraints = responseData.map(constraint => {
                    constraint.id = constraint._id
                    return constraint
                });
                return constraintsAdapter.setAll(initialState, loadedConstraints)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Constraint', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Constraint', id }))
                    ]
                } else return [{ type: 'Constraint', id: 'LIST' }]
            }
        }),
        addNewConstraint: builder.mutation({
            query: initialConstraint => ({
                url: '/constraints',
                method: 'POST',
                body: {
                    ...initialConstraint,
                }
            }),
            invalidatesTags: [
                { type: 'Constraint', id: "LIST" }
            ]
        }),
        updateConstraint: builder.mutation({
            query: initialConstraint => ({
                url: '/constraints',
                method: 'PATCH',
                body: {
                    ...initialConstraint,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Constraint', id: arg.id }
            ]
        }),
        deleteConstraint: builder.mutation({
            query: ({ id }) => ({
                url: '/constraints',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Constraint', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetConstraintsQuery,
    useAddNewConstraintMutation,
    useUpdateConstraintMutation,
    useDeleteConstraintMutation,
} = constraintsApiSlice

const selectConstraintsResult = constraintsApiSlice.endpoints.getConstraints.select()
const selectConstraintsData = createSelector(
    selectConstraintsResult,
    constraintsResult => constraintsResult.data
)

export const {
    selectAll: selectAllConstraints,
    selectById: selectConstraintById,
    selectIds: selectConstraintIds
} = constraintsAdapter.getSelectors(state => selectConstraintsData(state) ?? initialState)