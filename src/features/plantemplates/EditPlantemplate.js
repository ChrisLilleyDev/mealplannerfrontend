import { useParams } from 'react-router-dom'
import { useGetPlantemplatesQuery } from './plantemplatesApiSlice'
import { useGetConstraintsQuery } from '../constraints/constraintsApiSlice'
import { EditPlantemplateForm } from './EditPlantemplateForm'

export function EditPlantemplate() {
    const { id } = useParams()

    const { plantemplate } = useGetPlantemplatesQuery('plantemplatesList', {
        selectFromResult: ({ data }) => ({
            plantemplate: data?.entities[id]
        })
    })

    const {
        data: constraints,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetConstraintsQuery('constraintsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (!plantemplate || isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const allConstraints = Object.values(constraints.entities)
        const constraintsMap = new Map()
        allConstraints.forEach(constraint => constraintsMap.set(constraint.id, constraint.name))

        content = <EditPlantemplateForm plantemplate={plantemplate} allConstraints={allConstraints} constraintsMap={constraintsMap} />
    }

    return content
}