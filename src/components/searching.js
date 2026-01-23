import { createComparison, rules, defaultRules } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор

  // Создаем массив для поиска:
  const searchRules = [
    rules.skipEmptyTargetValues(), // вызываем как функцию!
    rules.searchMultipleFields(
      searchField, // имя поля поиска в state
      ["date", "customer", "seller"], // поля для поиска в данных
      false, // регистронезависимый поиск
    )(), // вызываем как функцию с аргументами, затем как функцию для создания правила
  ];

  const compare = createComparison(defaultRules, searchRules);

  return (data, state, action) => {
    // @todo: #5.2 — применить компаратор
    return data.filter((row) => compare(row, state));
  };
}
