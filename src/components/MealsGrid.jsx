import MealItem from "./MealItem"
import useHttp from "../hooks/useHttp"
import Error from "./Error"

const configHttp = {}

export default function MealsGrid() {
  const {
    data: meals,
    isLoading,
    error
  } = useHttp('http://localhost:3000/meals', configHttp, [])

  if (isLoading) {
    return <p className="center">Fetching meals...</p>
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />
  }

  return (
    <ul id="meals">
      {meals && meals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  )
}