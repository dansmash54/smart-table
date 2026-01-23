import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  
  console.log("=== TABLE INIT ===");
  console.log("Settings:", { tableTemplate, rowTemplate, before, after });

  // Клонируем основной шаблон таблицы
  console.log("Cloning main table template...");
  const root = cloneTemplate(tableTemplate);
  console.log("Main table cloned, root elements:", Object.keys(root.elements));

  // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
  if (Array.isArray(before)) {
    console.log("Adding BEFORE templates:", before);
    before.reverse().forEach((subName) => {
      console.log(`  - Cloning ${subName}...`);
      root[subName] = cloneTemplate(subName);
      console.log(`  - ${subName} cloned, prepending...`);
      root.container.prepend(root[subName].container);
    });
  }

  // Добавляем шаблоны ПОСЛЕ таблицы
  if (Array.isArray(after)) {
    console.log("Adding AFTER templates:", after);
    after.forEach((subName) => {
      console.log(`  - Cloning ${subName}...`);
      root[subName] = cloneTemplate(subName);
      console.log(`  - ${subName} cloned, appending...`);
      root.container.append(root[subName].container);
    });
  }

  // @todo: #1.3 — обработать события и вызвать onAction()
  console.log("Adding event listeners...");
  root.container.addEventListener("change", () => {
    console.log("Change event triggered");
    onAction();
  });

  root.container.addEventListener("reset", () => {
    console.log("Reset event triggered");
    setTimeout(onAction);
  });

  root.container.addEventListener("submit", (e) => {
    console.log("Submit event triggered, submitter:", e.submitter?.name);
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
    console.log("=== TABLE RENDER ===");
    console.log("Data received:", data.length, "rows");
    
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    console.log("Cloning row template...");
    const nextRows = data.map((item, index) => {
      // 1. клонируем шаблон
      const row = cloneTemplate(rowTemplate);
      
      // 2. Перебираем все ключи (поля) данных текущей строки
      Object.keys(item).forEach((key) => {
        // 3. Проверяем, существует ли элемент с таким именем в шаблоне
        if (row.elements[key]) {
          // 4. Присваиваем значение из данных в текстовое содержимое элемента
          row.elements[key].textContent = item[key];
        }
      });
      
      // 5. Возвращаем контейнер строки
      return row.container;
    });

    console.log("Rows created:", nextRows.length);
    
    // 6. добавление новых строк
    console.log("Root elements keys:", Object.keys(root.elements));
    const rowsContainer = root.elements.rows;
    console.log("Rows container found:", rowsContainer);
    
    if (rowsContainer) {
      console.log("Clearing old rows...");
      rowsContainer.innerHTML = "";
      console.log("Appending new rows...");
      rowsContainer.append(...nextRows);
      console.log("Rows appended, now has:", rowsContainer.children.length, "children");
    } else {
      console.error("ERROR: rows container not found in root.elements!");
      console.error("Available elements:", root.elements);
    }
    
    console.log("=== RENDER COMPLETE ===");
  };

  console.log("=== TABLE INIT COMPLETE ===");
  return { ...root, render };
}