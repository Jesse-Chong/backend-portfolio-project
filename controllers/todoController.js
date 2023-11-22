// DEPENDENCIES
const express = require("express");
const todo = express.Router();

const checklistController = require('./checklistController');
todo.use('/:todo_id/checklist', checklistController);

// QUERIES
const {
    getAllTodos,
    getTodo,
    createTodo,
    deleteTodo,
    updateTodo,
    updateCompletionStatus
}  = require('../queries/todo');

// Validations
const {
    checkTitle,
    checkDescription,
    checkDate,
    checkCategory
} = require('../validations/checkTodos')

todo.get('/', async (req, res) => {
    const allTodos = await getAllTodos();
    if (allTodos[0]) {
        res.status(200).json(allTodos);
    } else {
        res.status(404).json({ error: "todo not found" });
    }
});

todo.get('/:id', async (req, res) => {
    const { id } = req.params;
    const todo = await getTodo(id);
  
    if (todo) {
        // Isolate the string starting at T basically removing T05:00:00.000Z from the end
        todo.todo_date = todo.todo_date ? todo.todo_date.toISOString().split('T')[0] : null;
      res.status(200).json(todo);
    } else {
      res.status(404).json({ error: "todo not found" });
    }
  });

todo.post(
    '/', 
    checkTitle,
    checkDescription,
    checkDate,
    checkCategory,
    async (req, res) => {
    try {
        const todo = await createTodo(req.body);
        res.status(200).json(todo);
    } catch (error) {
        res.status(400).json({ error: "server error"})
    }
});

todo.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedTodo = await deleteTodo(id);
    
    if (deletedTodo.id) {
        res.status(200).json({ message: "todo deleted successfully" });
    } else {
        res.status(404).json({ error: "todo not found" });
    }
});

todo.put(
    '/:id',
    checkTitle,
    checkDescription,
    checkDate,
    checkCategory,
    async (req, res) => {
    try {
    const { id } = req.params;
    const updatedTodo = await updateTodo(id, req.body);
    res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(404).json({ error: "todo not found"})
    }
})

todo.put("/:id/completion", async (req, res) => {
    const { id } = req.params;
    try {
      const todoEntry = await getTodo(Number(id));
      if (!todoEntry) {
        return res.status(404).json("Todo entry not found");
      }
      const updatedTodoEntry = await updateCompletionStatus(
        id,
        !todoEntry.todo_istrue
      );
      if (updatedTodoEntry.id) {
        res.status(200).json(updatedTodoEntry);
      } else {
        res.status(500).json("Server error: Could not update completion status.");
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json("Server error: Could not update completion status.");
    }
  });

module.exports = todo;