import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SearchByIngredients from './pages/SearchByIngredients'
import RecipeDetails from './pages/RecipeDetails'
import Favorites from './pages/Favorites'
import MealPlanner from './pages/MealPlanner'
import ShoppingList from './pages/ShoppingList'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />

      {/* Routing aplikacji */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/by-ingredients" element={<SearchByIngredients />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/planner" element={<MealPlanner />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
