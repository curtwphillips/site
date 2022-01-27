const router = require("express").Router();

const redirect = require("./redirect");
const todos = require("./todos");
const user = require("./user");

const auth = require("./middleware/auth");

router.get("/user/:id", user.find);
router.put("/user/:id", user.update);
router.delete("/user/:id", user.delete);

router.post("/register", user.register);
router.post("/login", user.login);
router.post("/logout", user.logout);

// todo: add auth middleware
router.get('/todos', auth, todos.find);
router.delete('/todos/category/:_id', auth, todos.deleteCategory);
router.delete('/todos/todo/:_id/:todoId', auth, todos.deleteTodo);
router.post('/todos/todo/:_id', auth, todos.addTodo);
router.post('/todos/category', auth, todos.addCategory);
router.put('/todos/category/:_id', auth, todos.updateCategory);
router.put('/todos/todo/:_id', auth, todos.updateTodo);

router.get("*", redirect.destination);

module.exports = router;