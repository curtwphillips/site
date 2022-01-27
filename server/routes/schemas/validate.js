const Ajv = require("ajv");
const ajv = new Ajv({ removeAdditional: true });
const addFormats = require("ajv-formats");
addFormats(ajv);

const { todosCategoryUpdateSchema } = require('./todos/categoryUpdate');
const { todosCategorySchema } = require('./todos/category');
const { todosTodoSchema } = require('./todos/todo');
const { userSchema } = require('./user');

const schemas = {
  todosCategory: ajv.compile(todosCategorySchema),
  todosCategoryUpdate: ajv.compile(todosCategoryUpdateSchema),
  todosTodo: ajv.compile(todosTodoSchema),
  user: ajv.compile(userSchema),
}

exports.validate = (data, schemaName) => schemas[schemaName](data);
