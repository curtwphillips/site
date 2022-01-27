const { v4: uuidv4 } = require('uuid');

const { ObjectId } = require('mongodb');

const { validate } = require("./schemas/validate");
const { addToArray, find, findOneAndDelete, findOneAndUpdate, insertOne, removeFromArray, updateArrayByField } = require('../mongo/operations');

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

  const result = await insertOne('todos', categoryData);
  return res.status(201).json({ _id: result.insertedId });
};

exports.deleteCategory = async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(400).json({ error: 'Missing category id' });
  }

  await findOneAndDelete('todos', { userId: req.user._id, _id: ObjectId(_id) })
  return res.sendStatus(200);
};

exports.addTodo = async (req, res) => {
  const _id = ObjectId(req.params._id);

  const { errors } = validate(req.body, 'todosTodo');
  if (errors) {
    return res.status(400).send(errors);
  }

  const todo = req.body;
  todo.id = uuidv4();

  await addToArray("todos", { _id }, { todos: todo });
  return res.status(201).json({ todoId: todo.id });
};

exports.updateCategory = async (req, res) => {
  try {
    const _id = ObjectId(req.params._id);

    const { errors } = validate(req.body, 'todosCategoryUpdate');
    if (errors) {
      return res.status(400).send(errors);
    }

    await findOneAndUpdate('todos', { _id }, req.body);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.updateTodo = async (req, res) => {
  const _id = ObjectId(req.params._id);
  const todo = req.body;
  
  const update = {}
  for (let key in todo) {
    update[`todos.$.${key}`] = todo[key];
  }
  await updateArrayByField('todos', { _id, 'todos.id': todo.id }, update);
  res.sendStatus(200);
}

exports.deleteTodo = async (req, res) => {
  const { _id, todoId} = req.params;

  await removeFromArray('todos', { _id: ObjectId(_id) }, {
    todos: { id: todoId },
  });

  return res.sendStatus(200);
};