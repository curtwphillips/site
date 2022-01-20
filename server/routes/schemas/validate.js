const Ajv = require("ajv");
const ajv = new Ajv();
const addFormats = require("ajv-formats");
addFormats(ajv);

const { todosCategorySchema } = require('./todos/category');
const { todosTodoSchema } = require('./todos/todo');
const { userSchema } = require('./user');

const schemas = {
  todosCategory: ajv.compile(todosCategorySchema),
  todosTodo: ajv.compile(todosTodoSchema),
  user: ajv.compile(userSchema),
}

exports.validate = (data, schemaName) => schemas[schemaName](data);
