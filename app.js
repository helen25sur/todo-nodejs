// Зробити REST API на Express для керування завданнями, де всі дані зберігаються у файлі tasks.json. API має повністю працювати з цим файлом: при кожній зміні — перезапис, при кожному читанні — зчитування з файлу.
const path = require('path');

const methodOverride = require('method-override');
const express = require('express');
const bodyParser = require('body-parser');

const tasksRouter = require('./routes/taskRoutes');
const errorsRouter = require('./routes/errorsRoutes');
const readFileJson = require('./utils/readFileJson');
const logger = require('./utils/logger');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    return req.body._method;
  }
}));

app.use(logger);

const pathFile = path.join(__dirname, 'data', 'tasks.json');

app.use('/tasks', tasksRouter);

app.use('/', async(req, res, next) => {
  try {
    const tasks = await readFileJson(pathFile);
    res.render('index', {
      'tasks': tasks,
      'length': tasks.length, 
      done: tasks.filter(t => t.status === 'done').length,
      errors: [],
      formData: {}
    });

  } catch (error) {
    console.error(error);
  }
});

app.use(errorsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});