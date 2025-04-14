const allowedStatuses = ['todo', 'in-progress', 'done'];

function validateTask(data) {
  const errors = [];

  // Title
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title is required and must be at least 3 characters long.');
  }

  // Status
  if (!allowedStatuses.includes(data.status)) {
    errors.push('Status must be one of: todo, in-progress, done.');
  }

  return errors;
}

module.exports = validateTask;
