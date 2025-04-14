const { readFile } = require('fs/promises');

async function readFileJson(path) {
  const content = await readFile(path, { encoding: 'utf-8'});
  return JSON.parse(content);
}

module.exports = readFileJson;