import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiCheck, FiPlus } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { useMeals, DAYS_OF_WEEK } from '../context/MealContext'

function RecipeCard({ meal, matchInfo }) {
  const { isFavorite, toggleFavorite, addToPlan } = useMeals()

  const [selectedDay, setSelectedDay] = useState('Poniedziałek')
  const [addedSuccess, setAddedSuccess] = useState(false)

  const favorite = isFavorite(meal.idMeal)

  async function handleQuickPlan(e) {
    e.preventDefault()
    await addToPlan(selectedDay, meal, 'Obiad')
    setAddedSuccess(true)
    setTimeout(() => setAddedSuccess(false), 1200)
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 flex flex-col justify-between overflow-hidden">
      <div>
        <Link to={`/recipe/${meal.idMeal}`} className="block card-image-box">
          <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
        </Link>

        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="tag">{meal.strCategory || 'Recipe'}</span>

            <button
              type="button"
              onClick={() => toggleFavorite(meal)}
              className={favorite ? 'btn btn-danger btn-sm' : 'btn btn-secondary btn-sm'}
            >
              {favorite ? <FaHeart /> : <FiHeart />}
              <span>{favorite ? 'W ulubionych' : 'Polub'}</span>
            </button>
          </div>

          <Link to={`/recipe/${meal.idMeal}`} className="block">
            <h3 className="font-bold text-gray-900 text-sm hover:text-orange-600">
              {meal.strMeal}
            </h3>
          </Link>

          {matchInfo && (
            <div className="inner-box-green text-xs">
              <div className="font-bold text-emerald-900">
                Pasujące składniki: {matchInfo.matchedCount} z {matchInfo.totalCount}
              </div>
              {matchInfo.matchedNames.length > 0 && (
                <div className="text-emerald-800 truncate mt-0.5">
                  Masz: {matchInfo.matchedNames.join(', ')}
                </div>
              )}
            </div>
          )}

          <Link
            to={`/recipe/${meal.idMeal}`}
            className="inline-block text-xs font-bold text-orange-600 hover:underline"
          >
            Zobacz pełny przepis -&gt;
          </Link>
        </div>
      </div>

      {/* Szybkie dodawanie przepisu do wybranego dnia w planerze */}
      <form
        onSubmit={handleQuickPlan}
        className="p-2.5 bg-gray-50 border-t-2 border-gray-200 flex items-center gap-1.5"
      >
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="input input-sm flex-1 min-w-0"
        >
          {DAYS_OF_WEEK.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className={addedSuccess ? 'btn btn-success btn-sm' : 'btn btn-primary btn-sm'}
        >
          {addedSuccess ? <FiCheck /> : <FiPlus />}
          <span>{addedSuccess ? 'Dodano' : 'Do planera'}</span>
        </button>
      </form>
    </div>
  )
}

export default RecipeCard
