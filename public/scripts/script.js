const editButtons = document.querySelectorAll('button.btn-edit');
const deleteButtons = document.querySelectorAll('button.btn-danger');

function changeToEditableState(evt) {
  const target = evt.target;
  const li = target.closest('.list-group-item');
  li.style.textDecoration = 'none';

  // Дані завдання
  const title = li.querySelector('h3').innerText.trim();
  const description = li.querySelector('span.todo-list-item-label').innerText.trim();
  const id = li.querySelector('input[name="id"]').value;
  const status = li.dataset.status;

  // Якщо вже є форма — не додаємо ще одну
  if (li.querySelector('form.panel-add-item')) return;

  li.insertAdjacentHTML('beforeend', `
    <form action="/tasks/${id}" method="POST" class="panel-add-item">
      <input type="hidden" name="_method" value="PUT" />
      <input type="hidden" name="id" value="${id}">
      <div class="panel-add-item-block">
        <input class="form-control panel-add-item-input"
        type="text" placeholder="" aria-label="add task title" name="title"
        autocomplete="on" value="${title}">

        <select class="form-control" name="status">
          <option ${status === 'todo' ? 'selected' : ''} value="todo">ToDo</option>
          <option ${status === 'in-progress' ? 'selected' : ''} value="in-progress">In progress</option>
          <option ${status === 'done' ? 'selected' : ''} value="done">Done</option>
        </select>
      </div>

      <textarea class="form-control panel-add-item-input"
      name="description" aria-label="add task description"
      rows="2">${description}</textarea>

      <button type="submit" class="btn btn-warning ms-2">Edit</button>
    </form>
  `);
}

function deleteItem(evt) {
  const target = evt.target;
  const li = target.closest('.list-group-item');
  const id = li.querySelector('input[name="id"]').value;

  // Якщо вже є форма — не додаємо ще одну
  if (li.querySelector('form.panel-delete-item')) return;

  li.insertAdjacentHTML('beforeend', `
    <form action="/tasks/${id}" method="POST" class="panel-delete-item">
      <input type="hidden" name="_method" value="DELETE" />
      <input type="hidden" name="id" value="${id}">
    </form>
  `);

  const form = li.querySelector('form.panel-delete-item');
  setTimeout(() => form.submit(), 0);
}

// Прив'язуємо обробники
editButtons.forEach(btn => {
  btn.addEventListener('click', changeToEditableState);
});

deleteButtons.forEach(btn => {
  btn.addEventListener('click', deleteItem);
});

// Theme toggle
const changeThemeBtn = document.getElementById('theme-toggle');

const sun = `<svg class="change-theme-icon change-theme-icon_sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.!--><path d="M200.6-7.9c-6.7-4.4-15.1-5.2-22.5-2.2S165.4-.5 163.9 7.3L143 110.6 39.7 131.4c-7.8 1.6-14.4 7-17.4 14.3s-2.2 15.8 2.2 22.5L82.7 256 24.5 343.8c-4.4 6.7-5.2 15.1-2.2 22.5s9.6 12.8 17.4 14.3L143 401.4 163.9 504.7c1.6 7.8 7 14.4 14.3 17.4s15.8 2.2 22.5-2.2l87.8-58.2 87.8 58.2c6.7 4.4 15.1 5.2 22.5 2.2s12.8-9.6 14.3-17.4l20.9-103.2 103.2-20.9c7.8-1.6 14.4-7 17.4-14.3s2.2-15.8-2.2-22.5l-58.2-87.8 58.2-87.8c4.4-6.7 5.2-15.1 2.2-22.5s-9.6-12.8-17.4-14.3L433.8 110.6 413 7.3C411.4-.5 406-7 398.6-10.1s-15.8-2.2-22.5 2.2L288.4 50.3 200.6-7.9zM186.9 135.7l17-83.9 71.3 47.3c8 5.3 18.5 5.3 26.5 0l71.3-47.3 17 83.9c1.9 9.5 9.3 16.8 18.8 18.8l83.9 17-47.3 71.3c-5.3 8-5.3 18.5 0 26.5l47.3 71.3-83.9 17c-9.5 1.9-16.9 9.3-18.8 18.8l-17 83.9-71.3-47.3c-8-5.3-18.5-5.3-26.5 0l-71.3 47.3-17-83.9c-1.9-9.5-9.3-16.9-18.8-18.8l-83.9-17 47.3-71.3c5.3-8 5.3-18.5 0-26.5l-47.3-71.3 83.9-17c9.5-1.9 16.8-9.3 18.8-18.8zM239.6 256a48.4 48.4 0 1 1 96.8 0 48.4 48.4 0 1 1 -96.8 0zm144.8 0a96.4 96.4 0 1 0 -192.8 0 96.4 96.4 0 1 0 192.8 0z"/></svg>`;

const moon = `<svg class="change-theme-icon change-theme-icon_moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.!--><path d="M239.3 48.7c-107.1 8.5-191.3 98.1-191.3 207.3 0 114.9 93.1 208 208 208 33.3 0 64.7-7.8 92.6-21.7-103.4-23.4-180.6-115.8-180.6-226.3 0-65.8 27.4-125.1 71.3-167.3zM0 256c0-141.4 114.6-256 256-256 19.4 0 38.4 2.2 56.7 6.3 9.9 2.2 17.3 10.5 18.5 20.5s-4 19.8-13.1 24.4c-60.6 30.2-102.1 92.7-102.1 164.8 0 101.6 82.4 184 184 184 5 0 9.9-.2 14.8-.6 10.1-.8 19.6 4.8 23.8 14.1s2 20.1-5.3 27.1C387.3 484.8 324.8 512 256 512 114.6 512 0 397.4 0 256z"/></svg>`

function updateUI() {
  const isDark = document.documentElement.classList.contains('dark');
  changeThemeBtn.innerHTML = isDark ? sun : moon;
}

updateUI();

changeThemeBtn.addEventListener('click', () => {
 const isDark = document.documentElement.classList.toggle('dark');
  
  // Зберігаємо тільки рядок 'dark' або 'light'
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Оновлюємо іконку
  updateUI();
});