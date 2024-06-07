import { useGetConstraintsQuery } from '../constraints/constraintsApiSlice'
import { NewPlantemplateForm } from './NewPlantemplateForm'

export function NewPlantemplate() {
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

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const allConstraints = Object.values(constraints.entities)
        const constraintsMap = new Map()
        allConstraints.forEach(constraint => constraintsMap.set(constraint.id, constraint.name))

        content = <NewPlantemplateForm allConstraints={allConstraints} constraintsMap={constraintsMap} />
    }

    return content
}