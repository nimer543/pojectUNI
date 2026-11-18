Temat projektu: Aplikacja do wyszukiwania przepisów dań i planowania posiłków

Krótki opis:
Aplikacja webowa napisana w React, która pozwala na wyszukiwanie przepisów kulinarnych z publicznego API TheMealDB (również na podstawie posiadanych w domu składników), zapisywanie ulubionych dań oraz planowanie tygodniowego menu z automatycznym generowaniem listy zakupów.

Funkcjonalności w projekcie:
1. Wyszukiwarka przepisów - pobieranie i wyświetlanie przepisów z zewnętrznego API TheMealDB.
2. Wyszukiwanie po składnikach - możliwość wpisania składników, które użytkownik posiada w domu, i dopasowanie przepisów.
3. Filtrowanie i kategoryzacja - filtrowanie dań według kategorii i diet (np. Vegetarian, Vegan, Seafood, Chicken).
4. Ulubione przepisy - dodawanie i usuwanie przepisów z zakładki Ulubione (zapis w localStorage).
5. Planer posiłków - przypisywanie wybranych przepisów do konkretnych dni tygodnia (Poniedziałek - Niedziela) oraz pory posiłku (Śniadanie, Obiad, Kolacja).
6. Inteligentna lista zakupów - automatyczne generowanie listy potrzebnych składników na podstawie dań dodanych do planera, łączenie powtarzających się produktów oraz oznaczanie kupionych pozycji.
7. Responsywny interfejs - dostosowanie widoku do komputerów i urządzeń mobilnych.

Wykorzystane technologie i biblioteki:
- React
- React Router DOM (nawigacja między podstronami)
- Axios (zapytania HTTP do API)
- React Context API (zarządzanie globalnym stanem aplikacji)
- Tailwind CSS (stylowanie)
- React Icons (ikony)

Jak uruchomić projekt lokalnie:
1. Zainstaluj zależności:
   npm install

2. Uruchom serwer deweloperski:
   npm run dev

3. Otwórz w przeglądarce adres wyświetlony w terminalu (domyślnie http://localhost:5173).
