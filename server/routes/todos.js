const { ObjectId } = require('mongodb');

const { validate } = require("./schemas/validate");
const { find, findOneAndDelete, insertOne } = require('../mongo/operations');

/*
const exampleTodos = [
  {
    category: 'General',
    hidden: false,
    order: 0,
    todos: [
      {
         "name":"vitamins-morning",
         "text":"Took vitamins this morning",
         "checked":false,
         "order": 0,
         "recurring":true
      },
    ],
  },
];
*/

exports.find = async (req, res) => {
  const results = await find('todos', { userId: req.user._id });
  console.log('results:', results);
  return res.json(results || []);
};

/*
{
  category,
  hidden: false,
  order: getNewCategoryOrder(),
  todos: []
}
*/
exports.addCategory = async (req, res) => {
  const categoryData = req.body;
  categoryData.userId = req.user._id;

  const { errors } = validate(categoryData, 'todosCategory');
  if (errors) {
    return res.status(400).send(errors);
  }

  // ensure category does not exist already
  const results = await find('todos', { userId: req.user._id, category: categoryData.category });
  
  if (results.length) {
    return res.status(400).json({ error: 'Category already exists' });
  }

  await insertOne('todos', categoryData);
  return res.sendStatus(201);
};

exports.deleteCategory = async (req, res) => {
  const { _id } = req.params;

  console.log('req.params:', req.params);
  if (!_id) {
    console.log('received invalid req.params:', req.params);
    return res.status(400).json({ error: 'Missing category id' });
  }

  await findOneAndDelete('todos', { userId: req.user._id, _id: ObjectId(_id) })
  return res.sendStatus(200);
};

exports.addTodo = async (req, res) => {
  const { errors } = validate(req.body, 'todosTodo');
  if (errors) {
    return res.status(400).send(errors);
  }
  throw new Error('todo: insert todo into category todos array')
  // await insertOne("todos", req.body);
  // return res.sendStatus(201);
};

exports.updateTodo = async (req, res) => {
  // { category, todo: categoryData.todos[todoIndex] }
  const { category, todo } = req.body;

  const index = defaultTestTodos.findIndex((todos) => todos.category === category);

  if (index === -1) {
    return res.status(404);
  }

  const todoIndex = defaultTestTodos[index].findIndex((todos) => todos._id === todo._id);

  if (todoIndex === -1) {
    return res.status(404);
  }

  defaultTestTodos[index].todos[todoIndex] = todo;
  return res.json(defaultTestTodos || []);
}

exports.deleteTodo = async (req, res) => {
  // { category, todo: categoryData.todos[todoIndex] }
  const { category, todo } = req.body;

  const index = defaultTestTodos.findIndex((todos) => todos.category === category);

  if (index === -1) {
    return res.status(404);
  }

  const todoIndex = defaultTestTodos[index].findIndex((todos) => todos._id === todo._id);

  if (todoIndex === -1) {
    return res.status(404);
  }

  defaultTestTodos[index].todos.splice(todoIndex, 1);
  return res.json(defaultTestTodos || []);
};