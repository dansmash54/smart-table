import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  // Создаем массив для поиска:
  const searchRules = [
    rules.skipEmptyTargetValues,
    rules.searchMultipleFields(
      searchField, // имя поля поиска в state
      ["date", "customer", "seller"], // поля для поиска в данных
      false // регистронезависимый поиск
    ),
  ];
  const compare = createComparison(searchRules);
  return (data, state, action) => {
    // @todo: #5.2 — применить компаратор
    return data.filter((row) => compare(row, state));
  };
}
