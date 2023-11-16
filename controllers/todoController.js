// DEPENDENCIES
const express = require("express");
const todo = express.Router();

// QUERIES
const {
    getAllTodos,
    getTodo,
    createTodo,
    deleteTodo,
    updateTodo
}  = require('../queries/todo');

todo.get('/', async (req, res) => {
    const allTodos = await getAllTodos();
    if (allTodos[0]) {
        res.status(200).json(allTodos);
    } else {
        res.status(505).json({ error: "todo not error" });
    }
});

todo.get('/:id', async (req, res) => {
    const { id } = req.params;
        const todo = await getTodo(id);
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).json({ error: "todo not found" })
        }
});

todo.post('/', async (req, res) => {
    try {
        const todo = await createTodo(req.body);
        res.json(todo);
    } catch (error) {
        res.status(400).json({ error: "server error"})
    }
});

todo.delete('/:id', async (req,res) => {
    const { id } = req.params;
    const deletedTodo = await deleteTodo(id);
    if (deletedTodo.id) {
        res.status(200).json(deletedTodo);
    } else {
        res.status(404).json("todo not found")
    }
})

todo.put('/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const updatedTodo = await updateTodo(id, req.body);
    res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(404).json({ error: "todo not found"})
    }
})

module.exports = todo;