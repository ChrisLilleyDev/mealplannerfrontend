import { useGetMealsQuery } from "./mealsApiSlice"
import Meal from "./Meal"

function MealsList() {
  const {
    data: meals,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetMealsQuery(undefined, {
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
    const { ids } = meals

    const tableContent = ids?.length
      ? ids.map(mealId => <Meal key={mealId} mealId={mealId} />)
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

export default MealsList