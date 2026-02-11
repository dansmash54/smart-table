import "./fonts/ys-display/fonts.css";
import "./style.css";

// import { data as sourceData } from "./data/dataset_1.js";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

// Импорт модулей таблицы
import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
// замена константы
const api = initData();

// @todo: инициализация таблицы
const sampleTable = initTable(
  {
    tableTemplate: "#table",
    rowTemplate: "#row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render,
);

// @todo: инициализация поиска
const applySearching = initSearching("search");

// // @todo: инициализация фильтрации
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements,
);
//  {
//   searchBySeller: indexes.sellers,
// });

// @todo: инициализация сортировки
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// @todo: инициализация пагинации
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);
  return { ...state, rowsPerPage, page };
}
// добавление функции init()
async function init() {
  const indexes = await api.getIndexes();
  console.log("Индексы загружены:", indexes);
  updateIndexes({
    searchBySeller: indexes.sellers,
  });
}
/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  //ассинхронная
  let state = collectState(); // состояние полей из таблицы
  let query = {}; // формирование запроса
  // другие apply*
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  const { total, items } = await api.getRecords(query); // запрашиваем данные с собранными параметрами

  updatePagination(total, query);
  sampleTable.render(items);
}

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

init().then(() => render());
