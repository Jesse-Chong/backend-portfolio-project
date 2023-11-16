const db = require('../db/dbConfig');

const getAllTodos = async () => {
    try {
        const allTodos = await db.any("SELECT * FROM todo_tb");
        return allTodos;
      } catch (error) {
        return error;
      }
};

const getTodo = async (id) => {
    try {
        const oneTodo = await db.one("SELECT * FROM todo_tb WHERE id=$1", id);
        return oneTodo;
    } catch (error) {
        return error;
    }
};

const createTodo = async (todo) => {
    try {
        const newTodo = await db.one(
            "INSERT INTO todo_tb (todo_title, todo_description, todo_date, todo_istrue) VALUES($1, $2, $3, $4) RETURNING *",
            [todo.todo_title, todo.todo_description, todo.todo_date, todo.todo_istrue]
        )
        return newTodo;
    } catch (error) {
        return error;
    }
};

const deleteTodo = async (id) => {
    try {
        const deletedTodo = await db.one(
            "DELETE FROM todo_tb WHERE id =$1 RETURNING *",
            id
        );
        return deletedTodo;
    } catch (error) {
        return error;
    }
};

const updateTodo = async (id, todo) => {
    try {
        const updatedTodo = await db.one(
            "UPDATE todo_tb SET todo_title=$1, todo_description=$2, todo_date=$3, todo_istrue=$4 WHERE id=$5 RETURNING *",
            [todo.todo_title, todo.todo_description, todo.todo_date, todo.todo_istrue, id]
        );
        return updatedTodo
    } catch (error) {
        return error;
    }
};

module.exports = {
    getAllTodos,
    getTodo,
    createTodo,
    deleteTodo,
    updateTodo
}