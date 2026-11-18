import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiShoppingCart,
  FiCheckSquare,
  FiSquare,
  FiCalendar,
  FiCheck,
  FiRefreshCw,
} from 'react-icons/fi'
import { useMeals, DAYS_OF_WEEK } from '../context/MealContext'

function ShoppingList() {
  const {
    weeklyPlan,
    generateSmartShoppingList,
    checkedItems,
    toggleCheckedItem,
    totalPlannedMealsCount,
    shoppingFinished,
    finishShopping,
    startShopping,
    isMealCompleted,
  } = useMeals()

  const [hideOwned, setHideOwned] = useState(false)

  // Pobieranie wygenerowanej listy zakupów z kontekstu
  const fullShoppingList = generateSmartShoppingList()

  const displayedList = hideOwned
    ? fullShoppingList.filter((item) => !item.isOwnedAtHome)
    : fullShoppingList

  const ownedCount = fullShoppingList.filter((item) => item.isOwnedAtHome).length

  const plannedDishesSummary = []
  DAYS_OF_WEEK.forEach((day) => {
    const entries = weeklyPlan[day] || []
    entries.forEach((entry) => {
      plannedDishesSummary.push({
        entryId: entry.entryId,
        day: day,
        mealName: entry.meal.strMeal,
        mealId: entry.meal.idMeal,
        completed: shoppingFinished || isMealCompleted(entry.meal),
      })
    })
  })

  const hasAnyCheckedOrFinished =
    shoppingFinished || Object.values(checkedItems).some((v) => v === true)

  return (
    <div className="space-y-4">
      <section className="panel space-y-3">
        <div className="panel-header">
          <div className="flex flex-wrap items-center gap-2">
            <FiShoppingCart className="text-emerald-600 text-lg" />
            <h1 className="text-base font-bold text-gray-900">
              Inteligentna lista zakupów
            </h1>
            <span className="text-sm font-semibold text-gray-600">
              (Produkty: {fullShoppingList.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {totalPlannedMealsCount > 0 && hasAnyCheckedOrFinished && (
              <button
                type="button"
                onClick={startShopping}
                className="btn btn-primary"
              >
                <FiRefreshCw />
                <span>Rozpocznij zakupy</span>
              </button>
            )}

            {totalPlannedMealsCount > 0 && !shoppingFinished && fullShoppingList.length > 0 && (
              <button
                type="button"
                onClick={finishShopping}
                className="btn btn-success"
              >
                <FiCheck />
                <span>Zakończ zakupy</span>
              </button>
            )}

            <Link to="/planner" className="btn btn-secondary">
              <FiCalendar />
              <span>Planer posiłków</span>
            </Link>
          </div>
        </div>

        {plannedDishesSummary.length > 0 && (
          <div className="inner-box">
            <div className="label">
              Dania z planera ({plannedDishesSummary.length}):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {plannedDishesSummary.map((item) => (
                <Link
                  key={item.entryId}
                  to={`/recipe/${item.mealId}`}
                  className={item.completed ? 'tag tag-green' : 'tag'}
                >
                  {item.completed && '✓ '}
                  <strong>{item.day}:</strong> {item.mealName}
                  {item.completed && ' (zebrane)'}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {totalPlannedMealsCount === 0 ? (
        <section className="panel">
          <div className="empty-box">
            <p className="font-bold text-gray-800 mb-1">Twoja lista zakupów jest pusta.</p>
            <p className="text-xs mb-3">
              Dodaj przepis do Planera posiłków, aby wygenerować listę produktów.
            </p>
            <div className="flex justify-center gap-2">
              <Link to="/" className="btn btn-primary">
                <span>Wybierz przepisy</span>
              </Link>
              <Link to="/planner" className="btn btn-secondary">
                <FiCalendar />
                <span>Otwórz planer</span>
              </Link>
            </div>
          </div>
        </section>
      ) : fullShoppingList.length === 0 ? (
        <section className="panel">
          <div className="empty-box">
            <p className="font-bold text-gray-800 mb-1">
              Zakupy zakończone! Lista zakupów została wyczyszczona.
            </p>
            <p className="text-xs mb-3">
              Kliknij przycisk poniżej, aby ponownie załadować produkty z zaplanowanych dań.
            </p>
            <button
              type="button"
              onClick={startShopping}
              className="btn btn-primary"
            >
              <FiRefreshCw />
              <span>Rozpocznij zakupy</span>
            </button>
          </div>
        </section>
      ) : (
        <section className="panel-table">
          <div className="px-3.5 py-2.5 bg-gray-100 border-b-2 border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-gray-800">
              Lista potrzebnych składników ({displayedList.length})
            </span>

            {ownedCount > 0 && (
              <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideOwned}
                  onChange={(e) => setHideOwned(e.target.checked)}
                />
                <span>Ukryj składniki, które mam już w domu ({ownedCount})</span>
              </label>
            )}
          </div>

          <ul className="divide-y-2 divide-gray-200">
            {displayedList.map((item) => {
              const isChecked = !!checkedItems[item.key]

              return (
                <li
                  key={item.key}
                  onClick={() => toggleCheckedItem(item.key)}
                  className={`px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer ${
                    isChecked ? 'bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg shrink-0">
                      {isChecked ? (
                        <FiCheckSquare className="text-emerald-600" />
                      ) : (
                        <FiSquare className="text-gray-400" />
                      )}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-bold text-sm ${
                            isChecked ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}
                        >
                          {item.name}
                        </span>

                        {item.combinedMeasure && (
                          <span className="tag tag-orange">
                            Ilość: {item.combinedMeasure}
                          </span>
                        )}

                        {item.isOwnedAtHome && (
                          <span className="tag tag-green">Masz w domu</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 sm:text-right pl-7 sm:pl-0">
                    <span className="font-semibold text-gray-700">
                      {item.recipes.join(', ')}
                    </span>{' '}
                    ({item.days.join(', ')})
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}

export default ShoppingList
