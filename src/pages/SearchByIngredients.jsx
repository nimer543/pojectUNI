import { useState, useEffect } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'
import { useMeals } from '../context/MealContext'
import {
  filterMealsByIngredient,
  getMealById,
  extractIngredientsFromMeal,
} from '../services/mealApi'
import RecipeCard from '../components/RecipeCard'

const POPULAR_INGREDIENTS = [
  'Chicken',
  'Rice',
  'Garlic',
  'Onion',
  'Tomato',
  'Eggs',
  'Cheese',
  'Pasta',
]

function SearchByIngredients() {
  const { ownedIngredients, addOwnedIngredient, removeOwnedIngredient } = useMeals()

  const [inputValue, setInputValue] = useState('')
  const [suggestedMeals, setSuggestedMeals] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ownedIngredients.length > 0) {
      findRecipesFromOwnedIngredients()
    } else {
      setSuggestedMeals([])
    }
  }, [ownedIngredients])

  function handleAddSubmit(e) {
    e.preventDefault()
    if (!inputValue.trim()) return

    inputValue.split(',').forEach((part) => {
      if (part.trim()) addOwnedIngredient(part.trim())
    })
    setInputValue('')
  }

  // Wyszukiwanie i sortowanie przepisów na podstawie posiadanych składników
  async function findRecipesFromOwnedIngredients() {
    setLoading(true)
    try {
      const normalizedOwned = ownedIngredients.map((item) => item.trim().toLowerCase())
      const baseIngredients = normalizedOwned.slice(0, 3)

      const candidateMap = {}
      for (const ing of baseIngredients) {
        const list = await filterMealsByIngredient(ing)
        list.slice(0, 8).forEach((meal) => {
          candidateMap[meal.idMeal] = meal
        })
      }

      const candidateIds = Object.keys(candidateMap).slice(0, 8)
      const fullMeals = []
      for (const id of candidateIds) {
        const mealData = await getMealById(id)
        if (mealData) {
          fullMeals.push(mealData)
        }
      }

      const scoredMeals = fullMeals
        .map((meal) => {
          const recipeIngredients = extractIngredientsFromMeal(meal)
          const matchedNames = []

          recipeIngredients.forEach((recIng) => {
            const recIngLower = recIng.name.toLowerCase()
            const isMatch = normalizedOwned.some(
              (userIng) => recIngLower.includes(userIng) || userIng.includes(recIngLower)
            )
            if (isMatch) matchedNames.push(recIng.name)
          })

          return {
            meal,
            matchInfo: {
              matchedCount: matchedNames.length,
              totalCount: recipeIngredients.length,
              matchedNames: matchedNames,
            },
          }
        })
        .filter((item) => item.matchInfo.matchedCount > 0)
        .sort((a, b) => b.matchInfo.matchedCount - a.matchInfo.matchedCount)

      setSuggestedMeals(scoredMeals)
    } catch (error) {
      console.error('Błąd podczas wyszukiwania po składnikach:', error)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <section className="panel space-y-3">
        <div className="panel-header">
          <div>
            <h1 className="text-base font-bold text-gray-900">
              Wyszukiwanie przepisów po posiadanych składnikach
            </h1>
            <p className="text-gray-600 text-xs mt-1">
              Wpisz składniki, które masz w domu. Aplikacja znajdzie pasujące przepisy i posortuje
              je według liczby posiadanych produktów.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Wpisz składnik (np. chicken, garlic, rice)..."
            className="input flex-1"
          />
          <button type="submit" className="btn btn-primary">
            <FiPlus />
            <span>Dodaj składnik</span>
          </button>
        </form>

        <div className="inner-box">
          <div className="label">Posiadane składniki ({ownedIngredients.length}):</div>
          {ownedIngredients.length === 0 ? (
            <p className="text-xs text-gray-500">
              Lista jest pusta. Dodaj składnik powyżej lub wybierz z przycisków poniżej.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ownedIngredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center gap-2 bg-white border-2 border-emerald-500 text-gray-800 text-xs font-bold px-2 py-1 rounded"
                >
                  <span>{ing}</span>
                  <button
                    type="button"
                    onClick={() => removeOwnedIngredient(ing)}
                    className="inline-flex items-center gap-0.5 text-red-600 hover:text-red-800 font-bold"
                  >
                    <FiX />
                    <span>Usuń</span>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="label">Szybki wybór składników:</div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_INGREDIENTS.map((item) => {
              const isAdded = ownedIngredients.some(
                (owned) => owned.toLowerCase() === item.toLowerCase()
              )
              return (
                <button
                  key={item}
                  type="button"
                  disabled={isAdded}
                  onClick={() => addOwnedIngredient(item)}
                  className="btn btn-secondary btn-sm"
                >
                  <FiPlus />
                  <span>{item}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="text-base font-bold text-gray-900">
            Proponowane przepisy ({suggestedMeals.length})
          </h2>
        </div>

        {loading ? (
          <div className="empty-box font-semibold">
            Szukanie przepisów pasujących do Twoich składników...
          </div>
        ) : suggestedMeals.length === 0 ? (
          <div className="empty-box font-bold">
            Brak dopasowanych przepisów. Dodaj składniki powyżej.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {suggestedMeals.map(({ meal, matchInfo }) => (
              <RecipeCard key={meal.idMeal} meal={meal} matchInfo={matchInfo} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default SearchByIngredients
