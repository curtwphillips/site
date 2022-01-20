const defaultTestTodos = [
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
      {
        "name":"vitamins-night",
        "text":"Took vitamins this morning",
        "checked":false,
        "order": 1,
        "recurring":true
     }
    ],
  },
  {
    category: 'AA',
    hidden: false,
    order: 1,
    todos: [
      {
         "name":"aa",
         "text":"aa",
         "checked":false,
         "order": 0,
         "recurring":true
      },
    ],
  },
];

exports.find = async (req, res) => {
  // check db for todos of user


  return res.json(defaultTestTodos || []);
};

exports.addTodo = async (req, res) => {

  return res.sendStatus(200);
};

exports.addCategory = async (req, res) => {
  const categoryData = {
    category: req.body.category,
    hidden: false,
    order: defaultTestTodos.length,
    todos: [],
  }
  defaultTestTodos.push(categoryData);
  return res.json(defaultTestTodos || []);
};

exports.updateTodo = async (req, res) => {
  // { category, todo: categoryData.todos[todoIndex] }
  const { category, todo } = req.body;

  const index = defaultTestTodos.findIndex((todos) => todos.category === category);
  const todoIndex = defaultTestTodos[index].findIndex((todos) => todos._id === todo._id);
  defaultTestTodos
  return res.json(defaultTestTodos || []);
}
