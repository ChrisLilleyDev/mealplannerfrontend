import { useGetPlantemplatesQuery } from "./plantemplatesApiSlice"
import { Plantemplate } from "./Plantemplate"

export function PlantemplatesList() {
  const {
    data: plantemplates,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPlantemplatesQuery('plantemplateList', {
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
    const { ids } = plantemplates

    const tableContent = ids?.length
      ? ids.map(plantemplateId => <Plantemplate key={plantemplateId} plantemplateId={plantemplateId} />)
      : null

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">Status</th>
            <th scope="col" className="table__th note__created">Created</th>
            <th scope="col" className="table__th note__updated">Updated</th>
            <th scope="col" className="table__th note__title">Name</th>
            <th scope="col" className="table__th note__username">Owner</th>
            <th scope="col" className="table__th note__edit">Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )
  }

  return content
}