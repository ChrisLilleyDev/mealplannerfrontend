import { useGetInventoriesQuery } from "./inventoriesApiSlice"
import { Inventory } from "./Inventory"

export function InventoriesList() {
  const {
    data: inventories,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetInventoriesQuery('inventoriesList', {
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
    const { ids } = inventories

    const tableContent = ids?.length
      ? ids.map(inventoryId => <Inventory key={inventoryId} inventoryId={inventoryId} />)
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