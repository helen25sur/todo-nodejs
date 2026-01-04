const BIN_ID = process.env.BIN_ID;
const MASTER_KEY = process.env.MASTER_KEY;

async function deleteTask(taskId) {
  try {
    const getTasks = require('./getJson');
    const tasks = await getTasks();
    console.log(tasks);

    const updatedTasks = tasks.filter(task => task.id !== taskId);
    console.log(updatedTasks);

    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      },
      body: JSON.stringify({ tasks: updatedTasks })
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      throw new Error(`Не вдалося оновити JSONbin: ${JSON.stringify(errorDetail)}`);
    }

    const result = await response.json();
    console.log("✅ Успішно видалено. Оновлені дані в хмарі:", result.record.tasks);

    return result.record.tasks; // Повертаємо новий список для фронтенду
  } catch (error) {
    console.error("❌ Помилка при видаленні таски:", error.message);
    throw error;

  }

}

module.exports = deleteTask;