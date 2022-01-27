/*
{
  category,
  hidden: false,
  order: getNewCategoryOrder(),
  todos: []
}
*/
exports.todosCategoryUpdateSchema = {
  type: "object",
  properties: {
    userId: { type: "string" },
    category: { type: "string", maxLength: 64 },
    hidden: { type: "boolean" },
    order: { type: "number" },
    todos: { type: "array" },
  },
  required: [],
  additionalProperties: false,
};