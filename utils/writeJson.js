async function writeJson(tasks) {
  try {
    const BIN_ID = process.env.BIN_ID;
    const MASTER_KEY = process.env.MASTER_KEY;
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {  
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      },
      body: JSON.stringify({ tasks: tasks })
    });
  } catch (error) {
    console.error(error);
  }
  }

module.exports = writeJson;