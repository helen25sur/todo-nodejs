const BIN_ID = process.env.BIN_ID;
const MASTER_KEY = process.env.MASTER_KEY;

async function getTasks() {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Помилка:", errorData);
      return;
    }

    const data = await response.json();
    console.log(data.record.tasks);
    if (!data.record || !data.record.tasks || !Array.isArray(data.record.tasks)) {
      console.warn("Дані не містять очікуваної структури 'tasks'.");
      return [];
    }
    return data.record.tasks || [];
  } catch (error) {
    console.error("Помилка мережі:", error);
    return [];
  }
}

module.exports = getTasks;