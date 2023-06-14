import { useGetMealplansQuery } from "./mealplansApiSlice"
import Mealplan from "./Mealplan"

function MealplansList() {
  const {
    data: mealplans,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetMealplansQuery()

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = mealplans

    const tableContent = ids?.length
      ? ids.map(mealplanId => <Mealplan key={mealplanId} mealplanId={mealplanId} />)
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

export default MealplansList