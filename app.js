require('dotenv').config();

const path = require('path');

const methodOverride = require('method-override');
const express = require('express');
const bodyParser = require('body-parser');

const tasksRouter = require('./routes/taskRoutes');
const errorsRouter = require('./routes/errorsRoutes');
const getTasks = require('./utils/getJson');
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

app.use('/tasks', tasksRouter);

app.use('/', async(req, res, next) => {
  try {
    const tasks = await getTasks();
    res.render('index', {
      'tasks': tasks && Array.isArray(tasks) ? tasks : [],
      'length': tasks && Array.isArray(tasks) ? tasks.length : 0, 
      done: tasks && Array.isArray(tasks) ? tasks.filter(t => t.status === 'done').length : [],
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