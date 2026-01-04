/* Визначити маршрути REST API
GET /tasks — отримати всі завдання
GET /tasks/:id — отримати одне завдання
POST /tasks — додати нове
PUT /tasks/:id — оновити існуюче
DELETE /tasks/:id — видалити */
const path = require('path');

const express = require('express');
const {  v4: uuidv4 } = require('uuid'); 

const writeJson = require('../utils/writeJson');
const getTasks = require('../utils/getJson');
const deleteTaskJson = require('../utils/deleteTaskJson');
const validateTask = require('../utils/taskValidator');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const tasks = await getTasks();
  const task = tasks.find(item => item.id === id);
  if (!task) {
    return res.status(404).render('404', {message: 'Task not found'});
  }
  res.render('task', { 'task': task });
});

router.put('/:id', async (req, res, next) => {
  const errors = validateTask(req.body);
  const tasks = await getTasks();

  if (errors.length > 0) {
    const task = tasks.find(t => t.id === req.params.id);
    return res.status(400).render('index', {
      task: { ...task, ...req.body },
      tasks: tasks && Array.isArray(tasks) ? tasks : [],
      errors,
      formData: {}
    });
  }
  const id = req.params.id;
  console.log(id);

  const task = tasks.find(item => item.id === id);
  if (!task) {
    return res.status(404).render('404', {message: 'Task not found'});
  }

  task.title = task.title !== req.body.title ? req.body.title : task.title;
  task.description = task.description !== req.body.description ? req.body.description : task.description;
  task.status = task.status !== req.body.status ? req.body.status : task.status;
  task.modifiedAt = new Date();

  await writeJson(tasks);
  res.redirect('/');
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  await deleteTaskJson(id);
  res.redirect('/');
});

router.post('/', async (req, res, next) => {
  const errors = validateTask(req.body);
  const tasks = await getTasks();

  if (errors.length > 0) {
    return res.status(400).render('index', {
      tasks: tasks && Array.isArray(tasks) ? tasks : [],
      length: tasks && Array.isArray(tasks) ? tasks.length : 0,
      errors,
      formData: req.body
    });
  }
  
  const taskObj = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    createdAt: new Date()
  };
  tasks.push(taskObj);
  
  await writeJson(tasks);
  res.redirect('/');
});

router.get('/', async (req, res, next) => {
  if (req.query.status !== undefined) {
    try {
      const tasks = await getTasks();
      const filterTasks = tasks.filter(t => t.status === req.query.status)
      res.render('index', {
        'tasks': filterTasks,
        'length': tasks.length, 
        done: tasks.filter(t => t.status === 'done').length,
        errors: [],
        formData: {}
      });
  
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect('/');
  }
});


module.exports = router;