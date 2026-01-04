require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const tasksRouter = require('./routes/taskRoutes');
const errorsRouter = require('./routes/errorsRoutes');
const getTasks = require('./utils/getJson');
const logger = require('./utils/logger');

const app = express();

// 1. Повертаємо нормальні шляхи (views має бути в корені, не в public)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Налаштування статики та парсингу
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// 3. Логер
app.use(logger);

// 4. Маршрути (просто і зрозуміло)
app.use('/tasks', tasksRouter);

app.get('/', async (req, res) => {
  try {
    const tasksData = await getTasks();
    const tasks = Array.isArray(tasksData) ? tasksData : (tasksData.tasks || []);
    
    res.render('index', {
      tasks: tasks,
      length: tasks.length,
      done: tasks.filter(t => t.status === 'done').length,
      errors: [],
      formData: {}
    });
  } catch (error) {
    console.error("Render Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 5. Обробка помилок
app.use(errorsRouter);

// 6. Запуск сервера (Render сам призначає порт через змінну оточення)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});