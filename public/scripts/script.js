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
