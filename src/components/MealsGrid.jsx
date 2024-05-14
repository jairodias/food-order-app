import { useEffect, useState } from "react"
import MealItem from "./MealItem"

export default function MealsGrid() {
  const [meals, setMeals] = useState([])

  useEffect(() => {
    async function getMeals() {
      try {
        const response = await fetch("http://localhost:3000/meals")

        if (!response.ok) {
          console.error('Request failed.')
        }

        const meals = await response.json()
        setMeals(meals)
      } catch (error) {
        console.error('Request failed.', error)
      }
    }

    getMeals()
  }, [])

  return (
    <ul id="meals">
      {meals && meals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  )
}