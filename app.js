const serverless = require('serverless-http');
require('dotenv').config();
const path = require('path');
const methodOverride = require('method-override');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const tasksRouter = require('./routes/taskRoutes');
const errorsRouter = require('./routes/errorsRoutes');
const getTasks = require('./utils/getJson');
const logger = require('./utils/logger');

const app = express();

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
// Використовуємо абсолютний шлях для views
// app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(logger);

// Створюємо головний роутер для Netlify
const router = express.Router();

router.use('/tasks', tasksRouter);

router.get('/', async (req, res) => {
  try {
    const tasksData = await getTasks();
    // Переконуємося, що беремо масив tasks з об'єкта record
    const tasks = tasksData.tasks || tasksData; 
    
    res.render('index', {
      tasks: Array.isArray(tasks) ? tasks : [],
      length: Array.isArray(tasks) ? tasks.length : 0,
      done: Array.isArray(tasks) ? tasks.filter(t => t.status === 'done').length : 0,
      errors: [],
      formData: {}
    });
  } catch (error) {
    console.error("Render Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Підключаємо помилки до роутера
router.use(errorsRouter);

// ВАЖЛИВО: Весь додаток працює через цей шлях на Netlify
app.use('/.netlify/functions/app', router); 
app.use('/', router);

// Експортуємо обробник для Netlify
module.exports.handler = serverless(app);

// Тільки для локальної розробки
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Local server running on http://localhost:${port}`);
  });
}