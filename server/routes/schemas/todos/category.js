/*
{
  category,
  hidden: false,
  order: getNewCategoryOrder(),
  todos: []
}
*/
exports.todosCategorySchema = {
  type: "object",
  properties: {
    userId: { type: "string" },
    category: { type: "string", maxLength: 64 },
    hidden: { type: "boolean" },
    order: { type: "number" },
    todos: { type: "array" },
  },
  required: ["category", "order", "todos", "userId"],
};