import { useState, useEffect } from 'react'
import { FiSearch, FiRefreshCw } from 'react-icons/fi'
import {
  searchMealsByName,
  filterMealsByCategory,
} from '../services/mealApi'
import RecipeCard from '../components/RecipeCard'

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: 'Wszystkie kategorie i diety' },
  { value: 'Vegetarian', label: 'Wegetariańskie (Vegetarian)' },
  { value: 'Vegan', label: 'Wegańskie (Vegan)' },
  { value: 'Chicken', label: 'Kurczak (Chicken)' },
  { value: 'Beef', label: 'Wołowina (Beef)' },
  { value: 'Seafood', label: 'Owoce morza (Seafood)' },
  { value: 'Pasta', label: 'Makarony (Pasta)' },
  { value: 'Breakfast', label: 'Śniadania (Breakfast)' },
  { value: 'Dessert', label: 'Desery (Dessert)' },
]

function Home() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  useEffect(() => {
    loadRecipes(searchText, selectedCategory)
  }, [selectedCategory])

  // Pobieranie i filtrowanie przepisów z API
  async function loadRecipes(query, category) {
    setLoading(true)
    let results = []

    if (category !== 'ALL') {
      results = await filterMealsByCategory(category)

      if (query.trim() !== '') {
        const rawLower = query.trim().toLowerCase()
        results = results.filter((m) =>
          m.strMeal.toLowerCase().includes(rawLower)
        )
      }
    } else {
      results = await searchMealsByName(query)
    }

    setMeals(results)
    setLoading(false)
  }

  function handleSearchFormSubmit(e) {
    e.preventDefault()
    loadRecipes(searchText, selectedCategory)
  }

  function handleResetFilters() {
    setSearchText('')
    setSelectedCategory('ALL')
    loadRecipes('', 'ALL')
  }

  const hasActiveFilters = searchText.trim() !== '' || selectedCategory !== 'ALL'

  return (
    <div className="space-y-4">
      <section className="panel">
        <div className="panel-header">
          <h1 className="text-base font-bold text-gray-900">
            Wyszukiwarka i filtrowanie przepisów
          </h1>
          {hasActiveFilters && (
            <button type="button" onClick={handleResetFilters} className="btn btn-danger">
              <FiRefreshCw />
              <span>Wyczyść filtry</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <form onSubmit={handleSearchFormSubmit}>
            <label className="label">1. Szukaj po nazwie dania:</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="np. chicken, pasta, soup, cake..."
                className="input flex-1 min-w-0"
              />
              <button type="submit" className="btn btn-primary">
                <FiSearch />
                <span>Szukaj</span>
              </button>
            </div>
          </form>

          <div>
            <label className="label">2. Filtruj według diety / kategorii:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="text-base font-bold text-gray-900">
            Lista przepisów ({meals.length})
          </h2>
        </div>

        {loading ? (
          <div className="empty-box font-semibold">Ładowanie przepisów...</div>
        ) : meals.length === 0 ? (
          <div className="empty-box">
            <p className="font-bold text-gray-800 mb-1">Brak przepisów dla wybranych filtrów.</p>
            <p className="text-xs mb-3">Zmień kategorię lub wpisz inną nazwę dania.</p>
            <button type="button" onClick={handleResetFilters} className="btn btn-primary">
              <span>Pokaż wszystkie przepisy</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {meals.map((meal) => (
              <RecipeCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
