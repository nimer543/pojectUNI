import { createContext, useContext, useState, useEffect } from 'react'
import { getMealById, extractIngredientsFromMeal } from '../services/mealApi'

const MealContext = createContext()

export const DAYS_OF_WEEK = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
]

const initialWeeklyPlan = {
  Poniedziałek: [],
  Wtorek: [],
  Środa: [],
  Czwartek: [],
  Piątek: [],
  Sobota: [],
  Niedziela: [],
}

// Łączenie miar tego samego składnika bez duplikatów
function combineMeasures(rawMeasures) {
  const uniqueMeasures = []

  rawMeasures.forEach((raw) => {
    if (!raw) return
    const clean = raw.trim()

    if (clean !== '' && !uniqueMeasures.includes(clean)) {
      uniqueMeasures.push(clean)
    }
  })

  return uniqueMeasures.join(', ')
}

// Globalny kontekst aplikacji (React Context API)
export function MealProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('meal_favorites')
    return saved ? JSON.parse(saved) : []
  })

  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    const saved = localStorage.getItem('meal_weekly_plan')
    return saved ? JSON.parse(saved) : initialWeeklyPlan
  })

  const [ownedIngredients, setOwnedIngredients] = useState(() => {
    const saved = localStorage.getItem('meal_owned_ingredients')
    return saved ? JSON.parse(saved) : ['Chicken', 'Garlic', 'Onion']
  })

  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('meal_checked_items')
    return saved ? JSON.parse(saved) : {}
  })

  const [shoppingFinished, setShoppingFinished] = useState(() => {
    const saved = localStorage.getItem('meal_shopping_finished')
    return saved ? JSON.parse(saved) : false
  })

  // Synchronizacja stanu z localStorage
  useEffect(() => {
    localStorage.setItem('meal_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('meal_weekly_plan', JSON.stringify(weeklyPlan))
  }, [weeklyPlan])

  useEffect(() => {
    localStorage.setItem('meal_owned_ingredients', JSON.stringify(ownedIngredients))
  }, [ownedIngredients])

  useEffect(() => {
    localStorage.setItem('meal_checked_items', JSON.stringify(checkedItems))
  }, [checkedItems])

  useEffect(() => {
    localStorage.setItem('meal_shopping_finished', JSON.stringify(shoppingFinished))
  }, [shoppingFinished])

  function isFavorite(mealId) {
    return favorites.some((item) => item.idMeal === mealId)
  }

  // Dodawanie i usuwanie przepisu z ulubionych
  async function toggleFavorite(meal) {
    const exists = isFavorite(meal.idMeal)
    if (exists) {
      setFavorites(favorites.filter((item) => item.idMeal !== meal.idMeal))
    } else {
      let fullMeal = meal
      if (!meal.strIngredient1) {
        const fetched = await getMealById(meal.idMeal)
        if (fetched) fullMeal = fetched
      }
      setFavorites([...favorites, fullMeal])
    }
  }

  // Przypisanie przepisu do wybranego dnia tygodnia w planerze
  async function addToPlan(day, meal, mealType = 'Obiad') {
    let fullMeal = meal

    if (!meal.strIngredient1) {
      const fetched = await getMealById(meal.idMeal)
      if (fetched) fullMeal = fetched
    }

    setShoppingFinished(false)

    setWeeklyPlan((prevPlan) => {
      const currentDayMeals = prevPlan[day] || []

      const alreadyInDay = currentDayMeals.some((entry) => entry.meal.idMeal === fullMeal.idMeal)
      if (alreadyInDay) {
        return {
          ...prevPlan,
          [day]: currentDayMeals.map((entry) =>
            entry.meal.idMeal === fullMeal.idMeal ? { ...entry, mealType } : entry
          ),
        }
      }

      const newEntry = {
        entryId: `${day}-${fullMeal.idMeal}-${Date.now()}`,
        mealType: mealType,
        meal: fullMeal,
      }

      return {
        ...prevPlan,
        [day]: [...currentDayMeals, newEntry],
      }
    })
  }

  function removeFromPlan(day, entryId) {
    setWeeklyPlan((prevPlan) => ({
      ...prevPlan,
      [day]: prevPlan[day].filter((entry) => entry.entryId !== entryId),
    }))
  }

  function clearWeeklyPlan() {
    setWeeklyPlan(initialWeeklyPlan)
    setCheckedItems({})
    setShoppingFinished(false)
  }

  function addOwnedIngredient(ingredientName) {
    const clean = ingredientName.trim()
    if (!clean) return
    const alreadyExists = ownedIngredients.some(
      (item) => item.toLowerCase() === clean.toLowerCase()
    )
    if (!alreadyExists) {
      setOwnedIngredients([...ownedIngredients, clean])
    }
  }

  function removeOwnedIngredient(ingredientName) {
    setOwnedIngredients(
      ownedIngredients.filter((item) => item.toLowerCase() !== ingredientName.toLowerCase())
    )
  }

  function toggleCheckedItem(ingredientKey) {
    setCheckedItems((prev) => ({
      ...prev,
      [ingredientKey]: !prev[ingredientKey],
    }))
  }

  function finishShopping() {
    setShoppingFinished(true)
  }

  function startShopping() {
    setCheckedItems({})
    setShoppingFinished(false)
  }

  function isMealCompleted(meal) {
    const ings = extractIngredientsFromMeal(meal)
    if (ings.length === 0) return false
    return ings.every((ing) => !!checkedItems[ing.name.toLowerCase()])
  }

  // Algorytm generujący inteligentną listę zakupów na podstawie dań w planerze
  function generateSmartShoppingList() {
    if (shoppingFinished) return []

    const groupedIngredients = {}
    const ownedNormalized = ownedIngredients.map((ing) => ing.trim().toLowerCase())

    DAYS_OF_WEEK.forEach((day) => {
      const dayEntries = weeklyPlan[day] || []

      dayEntries.forEach((entry) => {
        if (isMealCompleted(entry.meal)) {
          return
        }

        const ingredients = extractIngredientsFromMeal(entry.meal)

        ingredients.forEach((ing) => {
          const key = ing.name.toLowerCase()

          if (!groupedIngredients[key]) {
            const isOwned = ownedNormalized.some(
              (owned) => key.includes(owned) || owned.includes(key)
            )

            groupedIngredients[key] = {
              key: key,
              name: ing.name,
              rawMeasures: [],
              recipes: [],
              days: [],
              isOwnedAtHome: isOwned,
            }
          }

          if (ing.measure) {
            groupedIngredients[key].rawMeasures.push(ing.measure)
          }

          if (!groupedIngredients[key].recipes.includes(entry.meal.strMeal)) {
            groupedIngredients[key].recipes.push(entry.meal.strMeal)
          }

          if (!groupedIngredients[key].days.includes(day)) {
            groupedIngredients[key].days.push(day)
          }
        })
      })
    })

    return Object.values(groupedIngredients)
      .map((item) => ({
        ...item,
        combinedMeasure: combineMeasures(item.rawMeasures),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const totalPlannedMealsCount = DAYS_OF_WEEK.reduce(
    (sum, day) => sum + (weeklyPlan[day] ? weeklyPlan[day].length : 0),
    0
  )

  return (
    <MealContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        weeklyPlan,
        addToPlan,
        removeFromPlan,
        clearWeeklyPlan,
        totalPlannedMealsCount,
        ownedIngredients,
        addOwnedIngredient,
        removeOwnedIngredient,
        checkedItems,
        toggleCheckedItem,
        shoppingFinished,
        finishShopping,
        startShopping,
        isMealCompleted,
        generateSmartShoppingList,
      }}
    >
      {children}
    </MealContext.Provider>
  )
}

export function useMeals() {
  return useContext(MealContext)
}
