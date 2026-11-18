import { Link } from 'react-router-dom'
import { FiHeart, FiSearch } from 'react-icons/fi'
import { useMeals } from '../context/MealContext'
import RecipeCard from '../components/RecipeCard'

function Favorites() {
  const { favorites } = useMeals()

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <FiHeart className="text-red-500" />
          <h1 className="text-base font-bold text-gray-900">
            Ulubione przepisy ({favorites.length})
          </h1>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-box">
          <p className="font-bold text-gray-800 mb-1">Nie masz jeszcze ulubionych przepisów.</p>
          <p className="text-xs mb-3">
            Kliknij przycisk Polub na karcie dania, aby dodać je do tej listy.
          </p>
          <Link to="/" className="btn btn-primary">
            <FiSearch />
            <span>Przejdź do wyszukiwarki</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {favorites.map((meal) => (
            <RecipeCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Favorites
