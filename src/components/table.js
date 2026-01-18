import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
  if (Array.isArray(before)) {
    before.reverse().forEach(subName => {
      // ctrl c шаблона и в root
      root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
      root.container.prepend(root[subName].container);   // добавляем к таблице ДО (prepend) - исправил на prepend!
    });
  }

  // Добавляем шаблоны ПОСЛЕ таблицы
  if (Array.isArray(after)) {
    after.forEach(subName => {
      // Клонируем шаблон и сохраняем в root для доступа позже
      root[subName] = cloneTemplate(subName);
      // Добавляем после таблицы (в конец контейнера)
      root.container.append(root[subName].container);
    });
  }

  // @todo: #1.3 —  обработать события и вызвать onAction()
  //   изменение полей
  root.container.addEventListener('change', () => {
    // Просто вызываем onAction без аргументов
    onAction();
  });
  
  // Обработчик события reset (сброс формы)
  root.container.addEventListener('reset', () => {
    // Используем setTimeout для задержки, потому что reset срабатывает быстрее очистки полей
    setTimeout(onAction);
  });

  // Обработчик события submit (отправка формы)
  root.container.addEventListener('submit', (e) => {
    // Предотвращаем стандартное поведение (перезагрузку страницы)
    e.preventDefault();
    // Вызываем onAction с кнопкой, которая вызвала submit
    onAction(e.submitter);
  });

  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      // 1. клонируем шаблон
      const row = cloneTemplate(rowTemplate);
      
      // 2. Перебираем все ключи (поля) данных текущей строки
      Object.keys(item).forEach(key => {
        // 3. Проверяем, существует ли элемент с таким именем в шаблоне
        if (row.elements[key]) {
          // 4. Присваиваем значение из данных в текстовое содержимое элемента
          row.elements[key].textContent = item[key];
        }
      });
      
      // 5. Возвращаем контейнер строки
      return row.container;
    });
    
    // 6. добавление новых строк
    root.elements.tbody.innerHTML = ''; // Очищаем старые строки
    root.elements.tbody.append(...nextRows); // Добавляем новые строки
  };

  return { ...root, render };
}