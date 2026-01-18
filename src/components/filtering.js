import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
  // @todo: #4.3 — настроить компаратор
  const compare = createComparison(defaultRules);
  
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => {
      // Перебираем по именам
      if (elements[elementName]) {
        elements[elementName].append(
          // в каждый элемент добавляем опции
          ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
            .map((name) => {
              // используйте name как значение и текстовое содержимое
              // Создаём элемент option
              const option = document.createElement('option');
              option.value = name;
              option.textContent = name;
              return option;
            })
        );
      }
    });
    
  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === 'clear') {
      const field = action.dataset.field;
      if (field) {
        // Находим связанный input через data-name
        const fieldName = `searchBy${field.charAt(0).toUpperCase() + field.slice(1)}`;
        if (elements[fieldName] && elements[fieldName].tagName === 'INPUT') {
          elements[fieldName].value = '';
          // Обновляем state
          state[field] = '';
        }
      }
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter(row => compare(row, state));
  };
}