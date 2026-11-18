import { Link } from 'react-router-dom'
import { FiCalendar, FiTrash2, FiShoppingCart, FiPlus } from 'react-icons/fi'
import { useMeals, DAYS_OF_WEEK } from '../context/MealContext'
import { extractIngredientsFromMeal } from '../services/mealApi'

function MealPlanner() {
  const {
    weeklyPlan,
    addToPlan,
    removeFromPlan,
    clearWeeklyPlan,
    favorites,
    totalPlannedMealsCount,
  } = useMeals()

  function handleSelectFavoriteForDay(day, mealId) {
    if (!mealId) return
    const found = favorites.find((f) => f.idMeal === mealId)
    if (found) {
      addToPlan(day, found, 'Obiad')
    }
  }

  function handleChangeMealType(day, meal, newType) {
    addToPlan(day, meal, newType)
  }

  return (
    <div className="space-y-4">
      <section className="panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-orange-600 text-lg" />
              <h1 className="text-base font-bold text-gray-900">
                Planer posiłków na tydzień
              </h1>
              <span className="text-sm font-semibold text-gray-600">
                (Zaplanowane dania: {totalPlannedMealsCount})
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Przypisz przepisy do poszczególnych dni tygodnia. Na podstawie tego planu automatycznie
              tworzy się Twoja lista zakupów.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {totalPlannedMealsCount > 0 && (
              <button type="button" onClick={clearWeeklyPlan} className="btn btn-danger">
                <FiTrash2 />
                <span>Wyczyść plan</span>
              </button>
            )}
            <Link to="/shopping-list" className="btn btn-success">
              <FiShoppingCart />
              <span>Przejdź do listy zakupów</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Widok tygodniowego planu z podziałem na dni */}
      <div className="space-y-3">
        {DAYS_OF_WEEK.map((day) => {
          const dayMeals = weeklyPlan[day] || []

          return (
            <section key={day} className="panel">
              <div className="panel-header">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-900">{day}</h2>
                  <span className="tag">
                    {dayMeals.length === 0
                      ? 'Brak dań'
                      : `Liczba dań: ${dayMeals.length}`}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {favorites.length > 0 && (
                    <select
                      value=""
                      onChange={(e) => handleSelectFavoriteForDay(day, e.target.value)}
                      className="input input-sm input-auto"
                    >
                      <option value="">+ Dodaj z ulubionych na {day}...</option>
                      {favorites.map((fav) => (
                        <option key={fav.idMeal} value={fav.idMeal}>
                          {fav.strMeal}
                        </option>
                      ))}
                    </select>
                  )}

                  <Link
                    to="/"
                    className="btn btn-secondary btn-sm"
                  >
                    <FiPlus />
                    <span>Wybierz z przepisów</span>
                  </Link>
                </div>
              </div>

              {dayMeals.length === 0 ? (
                <div className="empty-box">
                  Nie zaplanowano jeszcze żadnego posiłku na <strong>{day}</strong>. Dodaj przepis z
                  wyszukiwarki lub wybierz z ulubionych powyżej.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dayMeals.map((entry) => {
                    const ingCount = extractIngredientsFromMeal(entry.meal).length

                    return (
                      <div
                        key={entry.entryId}
                        className="inner-box flex items-center justify-between gap-3 bg-white"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Link to={`/recipe/${entry.meal.idMeal}`}>
                            <img
                              src={entry.meal.strMealThumb}
                              alt={entry.meal.strMeal}
                              className="thumb-small"
                            />
                          </Link>

                          <div className="min-w-0 space-y-1">
                            <Link
                              to={`/recipe/${entry.meal.idMeal}`}
                              className="block text-sm font-bold text-gray-900 hover:text-orange-600 truncate"
                            >
                              {entry.meal.strMeal}
                            </Link>

                            <div className="flex flex-wrap items-center gap-1.5">
                              <select
                                value={entry.mealType}
                                onChange={(e) =>
                                  handleChangeMealType(day, entry.meal, e.target.value)
                                }
                                className="input input-sm input-auto font-bold"
                              >
                                <option value="Śniadanie">Śniadanie</option>
                                <option value="Obiad">Obiad</option>
                                <option value="Kolacja">Kolacja</option>
                              </select>

                              <span className="text-xs text-gray-500">
                                ({ingCount} składników)
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromPlan(day, entry.entryId)}
                          className="btn btn-danger btn-sm shrink-0"
                        >
                          <FiTrash2 />
                          <span>Usuń</span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default MealPlanner
