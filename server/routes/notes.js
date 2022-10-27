const { v4: uuidv4 } = require('uuid');

const { ObjectId } = require('mongodb');

const { validate } = require('./schemas/validate');
const {
  addToArray,
  find,
  findOneAndDelete,
  findOneAndUpdate,
  insertOne,
  removeFromArray,
  updateArrayByField,
} = require('../mongo/operations');

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
  const results = await find('notes', { userId: req.user._id });
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

exports.add = async (req, res) => {
  const _id = ObjectId(req.params._id);

  const { errors } = validate(req.body, 'todosTodo');
  if (errors) {
    return res.status(400).send(errors);
  }

  const todo = req.body;
  todo.id = uuidv4();

  await addToArray('todos', { _id }, { todos: todo });
  return res.status(201).json({ todoId: todo.id });
};

exports.update = async (req, res) => {
  const _id = ObjectId(req.params._id);
  const todo = req.body;

  const update = {};
  for (let key in todo) {
    update[`todos.$.${key}`] = todo[key];
  }
  await updateArrayByField('todos', { _id, 'todos.id': todo.id }, update);
  res.sendStatus(200);
};

exports.delete = async (req, res) => {
  const { _id, todoId } = req.params;

  await removeFromArray(
    'todos',
    { _id: ObjectId(_id) },
    {
      todos: { id: todoId },
    }
  );

  return res.sendStatus(200);
};
