import axios from 'axios'

// Konfiguracja Axios dla publicznego API TheMealDB
const API_URL = 'https://www.themealdb.com/api/json/v1/1'

const api = axios.create({
  baseURL: API_URL,
})

// Wyszukiwanie przepisów po nazwie
export async function searchMealsByName(query) {
  try {
    const cleanQuery = query ? query.trim() : ''

    const response = await api.get(`/search.php?s=${cleanQuery}`)
    if (response.data.meals && response.data.meals.length > 0) {
      return response.data.meals.slice(0, 12)
    }

    if (cleanQuery) {
      const byIng = await api.get(`/filter.php?i=${cleanQuery}`)
      if (byIng.data.meals && byIng.data.meals.length > 0) {
        return byIng.data.meals.slice(0, 12)
      }
    }

    return []
  } catch (error) {
    console.error('Błąd podczas wyszukiwania przepisów:', error)
    return []
  }
}

// Pobieranie szczegółów przepisu po ID
export async function getMealById(id) {
  try {
    const response = await api.get(`/lookup.php?i=${id}`)
    if (response.data.meals && response.data.meals.length > 0) {
      return response.data.meals[0]
    }
    return null
  } catch (error) {
    console.error('Błąd podczas pobierania przepisu:', error)
    return null
  }
}

// Filtrowanie przepisów według kategorii lub diety
export async function filterMealsByCategory(category) {
  try {
    const response = await api.get(`/filter.php?c=${category}`)
    const meals = (response.data.meals || []).slice(0, 12)
    return meals.map((m) => ({ ...m, strCategory: category }))
  } catch (error) {
    console.error('Błąd podczas filtrowania po kategorii:', error)
    return []
  }
}

// Filtrowanie przepisów według składnika
export async function filterMealsByIngredient(ingredient) {
  try {
    const clean = ingredient ? ingredient.trim() : ''
    const response = await api.get(`/filter.php?i=${clean}`)
    return (response.data.meals || []).slice(0, 12)
  } catch (error) {
    console.error('Błąd podczas filtrowania po składniku:', error)
    return []
  }
}

// Pobieranie listy składników z obiektu przepisu (pola 1..20)
export function extractIngredientsFromMeal(meal) {
  const list = []
  if (!meal) return list

  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]

    if (name && name.trim() !== '') {
      const cleanName = name.trim()
      const cleanMeasure = measure ? measure.trim() : ''

      const existing = list.find(
        (item) => item.name.toLowerCase() === cleanName.toLowerCase()
      )

      if (!existing) {
        list.push({
          name: cleanName,
          measure: cleanMeasure,
        })
      }
    }
  }

  return list
}
