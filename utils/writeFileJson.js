const { writeFile } = require('fs/promises');

async function writeFileJson(path, tasks) {
  try {
    await writeFile(path, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error(error);
  }
  }

module.exports = writeFileJson;