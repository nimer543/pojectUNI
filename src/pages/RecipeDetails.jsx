import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiHeart, FiCalendar, FiCheck, FiYoutube, FiPlus } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { getMealById, extractIngredientsFromMeal } from '../services/mealApi'
import { useMeals, DAYS_OF_WEEK } from '../context/MealContext'

function RecipeDetails() {
  const { id } = useParams()
  const { isFavorite, toggleFavorite, addToPlan, ownedIngredients } = useMeals()

  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedDay, setSelectedDay] = useState('Poniedziałek')
  const [selectedType, setSelectedType] = useState('Obiad')
  const [addedToPlan, setAddedToPlan] = useState(false)

  // Pobieranie danych przepisu na podstawie parametru ID z adresu URL
  useEffect(() => {
    async function loadDetails() {
      setLoading(true)
      const data = await getMealById(id)
      setMeal(data)
      setLoading(false)
    }
    loadDetails()
  }, [id])

  async function handlePlanSubmit(e) {
    e.preventDefault()
    if (!meal) return
    await addToPlan(selectedDay, meal, selectedType)
    setAddedToPlan(true)
    setTimeout(() => setAddedToPlan(false), 1500)
  }

  if (loading) {
    return <div className="panel empty-box font-bold">Ładowanie szczegółów przepisu...</div>
  }

  if (!meal) {
    return (
      <div className="panel text-center">
        <h2 className="text-base font-bold text-gray-800 mb-2">Nie znaleziono przepisu</h2>
        <Link to="/" className="btn btn-primary">
          Wróć do listy przepisów
        </Link>
      </div>
    )
  }

  const ingredients = extractIngredientsFromMeal(meal)
  const favorite = isFavorite(meal.idMeal)
  const normalizedOwned = ownedIngredients.map((i) => i.trim().toLowerCase())

  return (
    <div className="space-y-4">
      <div>
        <Link to="/" className="btn btn-secondary">
          <FiArrowLeft />
          <span>Powrót do wyszukiwarki</span>
        </Link>
      </div>

      <section className="panel">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="details-image-box">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {meal.strCategory && (
                  <span className="tag">Kategoria: {meal.strCategory}</span>
                )}
                {meal.strArea && (
                  <span className="tag">Kuchnia: {meal.strArea}</span>
                )}
              </div>
              <h1 className="text-xl font-extrabold text-gray-900">{meal.strMeal}</h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite(meal)}
                className={favorite ? 'btn btn-danger' : 'btn btn-secondary'}
              >
                {favorite ? <FaHeart /> : <FiHeart />}
                <span>{favorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}</span>
              </button>

              {meal.strYoutube && (
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-danger"
                >
                  <FiYoutube />
                  <span>Film z przepisem (YouTube)</span>
                </a>
              )}
            </div>

            <form onSubmit={handlePlanSubmit} className="inner-box space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <FiCalendar className="text-orange-600" />
                <span>Przypisz przepis do dnia tygodnia w planerze:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="input input-auto"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input input-auto"
                >
                  <option value="Śniadanie">Śniadanie</option>
                  <option value="Obiad">Obiad</option>
                  <option value="Kolacja">Kolacja</option>
                </select>

                <button
                  type="submit"
                  className={addedToPlan ? 'btn btn-success' : 'btn btn-primary'}
                >
                  {addedToPlan ? <FiCheck /> : <FiPlus />}
                  <span>{addedToPlan ? 'Dodano do planera' : 'Dodaj do planera'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="panel h-fit">
          <div className="panel-header">
            <h2 className="text-base font-bold text-gray-900">
              Składniki ({ingredients.length})
            </h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {ingredients.map((item, index) => {
              const hasAtHome = normalizedOwned.some(
                (owned) =>
                  item.name.toLowerCase().includes(owned) ||
                  owned.includes(item.name.toLowerCase())
              )
              return (
                <li key={index} className="py-2 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    {hasAtHome && <span className="tag tag-green">Masz w domu</span>}
                  </div>
                  <span className="text-gray-600 text-right">{item.measure}</span>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="panel lg:col-span-2">
          <div className="panel-header">
            <h2 className="text-base font-bold text-gray-900">Sposób przygotowania</h2>
          </div>
          <div className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">
            {meal.strInstructions}
          </div>
        </section>
      </div>
    </div>
  )
}

export default RecipeDetails
