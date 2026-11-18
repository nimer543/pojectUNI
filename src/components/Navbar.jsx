import { Link, useLocation } from 'react-router-dom'
import {
  FiSearch,
  FiHeart,
  FiCalendar,
  FiShoppingCart,
  FiPackage,
} from 'react-icons/fi'
import { useMeals } from '../context/MealContext'




function Navbar() {
  const location = useLocation()
  const { favorites, totalPlannedMealsCount, generateSmartShoppingList } = useMeals()
  const shoppingCount = generateSmartShoppingList().length

  const navLinks = [
    { path: '/', label: 'Wyszukiwarka przepisów', icon: <FiSearch /> },
    { path: '/by-ingredients', label: 'Wyszukiwanie po składnikach', icon: <FiPackage /> },
    { path: '/favorites', label: 'Ulubione', icon: <FiHeart />, badge: favorites.length },
    {
      path: '/planner',
      label: 'Planer posiłków',
      icon: <FiCalendar />,
      badge: totalPlannedMealsCount,
    },
    {
      path: '/shopping-list',
      label: 'Lista zakupów',
      icon: <FiShoppingCart />,
      badge: shoppingCount,
    },
  ]




  return (
    <header className="bg-white border-b-2 border-gray-300 sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              className={isActive ? 'nav-btn nav-btn-active' : 'nav-btn'}
            >
              {link.icon}
              <span>{link.label}</span>
              {link.badge > 0 && <span className="nav-badge">{link.badge}</span>}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
export default Navbar
