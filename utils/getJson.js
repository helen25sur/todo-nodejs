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
    return data.record["tasks"];
  } catch (error) {
    console.error("Помилка мережі:", error);
  }
}

module.exports = getTasks;