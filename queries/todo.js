const db = require('../db/dbConfig');

const getAllTodos = async () => {
    const allTodos = await db.any('SELECT * FROM todo_tb');
    return allTodos.map(todo => ({
      ...todo,
      todo_date: todo.todo_date.toISOString().split('T')[0],
    }));
  };

// instanceof is used to check if an object belongs to a particular class. In this case it is checking
// if the error is a general javascript error object && also checks if specific error code value of 0
// which would be QueryResultError indicating no rows returned.
const getTodo = async (id) => {
    try {
        const oneTodo = await db.one("SELECT * FROM todo_tb WHERE id=$1", id);
        return oneTodo;
    } catch (error) {
        // Check if it's a QueryResultError with code 0
        if (error instanceof Error && error.code === 0) {
        // Return null for non-existing todos
            return null;
        }
        console.error("Error fetching todo:", error);
        return { error: "Error fetching todo", details: error.message };
    }
};

const createTodo = async (todo) => {
    try {
        const newTodo = await db.one(
            "INSERT INTO todo_tb (todo_title, todo_description, todo_date, todo_istrue, todo_category) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [todo.todo_title, todo.todo_description, todo.todo_date, todo.todo_istrue, todo.todo_category]
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
            "UPDATE todo_tb SET todo_title=$1, todo_description=$2, todo_date=$3, todo_istrue=$4, todo_category=$5 WHERE id=$6 RETURNING *",
            [todo.todo_title, todo.todo_description, todo.todo_date, todo.todo_istrue, todo.todo_category, id]
        );
        return updatedTodo;
    } catch (error) {
        throw error;
    }
};

const updateCompletionStatus = async (id, is_true) => {
    try {
      const updatedTodo = await db.one(
        "UPDATE todo_tb SET todo_istrue=$1 WHERE id=$2 RETURNING *",
        [is_true, id]
      );
      return updatedTodo;
    } catch (error) {
      console.error("Error updating completion status:", error);
      throw error;
    }
  };

module.exports = {
    getAllTodos,
    getTodo,
    createTodo,
    deleteTodo,
    updateTodo,
    updateCompletionStatus
}