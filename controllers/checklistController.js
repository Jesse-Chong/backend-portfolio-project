// Dependencies
const express = require("express");
// CHILD MODEL gets mergeParams
const checklist = express.Router({ mergeParams: true });
const { getTodo } = require('../queries/todo');

// QUERIES
const {  
    getAllChecklist,
    getChecklist,
    createChecklist,
    deleteChecklist,
    updateChecklist,
} = require('../queries/checklist')

// Validations
const { checkCheckListDescription } = require('../validations/checkChecklist')

checklist.get('/', async (req, res) => {
    const { todo_id } = req.params;
    const allChecklist = await getAllChecklist(todo_id);
    const toDo = await getTodo(todo_id);

    if (toDo) {
        res.status(200).json({ ...toDo, allChecklist });
    } else {
        res.status(500).json({ error: "server error" });
    }
});

checklist.get('/:id', async (req, res) => {
    const { todo_id, id } = req.params;
    const oneChecklist = await getChecklist(id);
    const toDo = await getTodo(todo_id);

    if (oneChecklist) {
        res.status(200).json({ ...toDo, oneChecklist})
    } else {
        res.status(404).json({ error: "checklist not found" })
    }
});

checklist.put(
    '/:id',
    checkCheckListDescription,
    async (req, res) => {
    const { todo_id, id } = req.params;
    const updatedChecklist = await updateChecklist(id, { todo_id, ...req.body });
    if (updatedChecklist.id) {
        res.status(200).json(updatedChecklist);
    } else {
        res.status(404).json({ error: "checklist not found" });
    }
});

checklist.post(
    '/',
    checkCheckListDescription,
    async (req, res) => {
    const { todo_id } = req.params;
    const createdChecklist = await createChecklist({ todo_id, ...req.body });
    res.status(200).json(createdChecklist);
});

checklist.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedChecklist = await deleteChecklist(id);
    if (deletedChecklist.id) {
        res.status(200).json(deletedChecklist);
    } else {
        res.status(404).json({ error: "checklist not found" })
    }
});

module.exports = checklist