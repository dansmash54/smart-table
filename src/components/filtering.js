export function initFiltering(elements) {
  // Функция для заполнения выпадающих списков
  const updateIndexes = (indexes) => {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
      if (elements[elementName]) {
        elements[elementName].append(
          ...Object.values(indexes[elementName]).map((name) => {
            const el = document.createElement("option");
            el.textContent = name;
            el.value = name;
            return el;
          }),
        );
      }
    });
  };

  // Функция для формирования параметров фильтрации
  const applyFiltering = (query, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      if (field) {
        const fieldName = `searchBy${field.charAt(0).toUpperCase() + field.slice(1)}`;
        if (elements[fieldName] && elements[fieldName].tagName === "INPUT") {
          elements[fieldName].value = "";
          state[field] = "";
        }
      }
    }

    // @todo: #4.5 — формируем параметры фильтрации для сервера
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          filter[`filter[${elements[key].name}]`] = elements[key].value;
        }
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
