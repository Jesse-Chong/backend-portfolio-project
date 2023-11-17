const db = require('../db/dbConfig');

const getAllChecklist = async (todo_id) => {
    try {
        const allChecklist = await db.any("SELECT * FROM checklist_tb WHERE todo_id=$1", todo_id);
        return allChecklist;
    } catch (error) {
        return error;
    }
};

  const getChecklist = async (id) => {
    try {
        const oneChecklist = await db.one("SELECT * FROM checklist_tb WHERE id=$1", id);
        return oneChecklist;
    } catch (error) {
        return error;
    }
  }

  const createChecklist = async (checklist) => {
    try {
        const newChecklist = await db.one(
            "INSERT INTO checklist_tb (checklist_description, checklist_istrue, todo_id) VALUES($1, $2, $3) RETURNING *",
            [checklist.checklist_description, checklist.checklist_istrue, checklist.todo_id]
        );
        return newChecklist;
    } catch (error) {
        return error;
    }
  }

  const deleteChecklist = async (id) => {
    try {
      const deletedChecklist = await db.one(
        "DELETE FROM checklist_tb WHERE id = $1 RETURNING *",
        id
      );
      return deletedChecklist;
    } catch (error) {
      return error;
    }
  };

  const updateChecklist = async (id, checklist) => {
    try {
        const updatedChecklist = await db.one(
            "UPDATE checklist_tb SET checklist_description=$1, checklist_istrue=$2 WHERE id=$3 RETURNING *",
            [
                checklist.checklist_description, 
                checklist.checklist_istrue,
                id
            ]
        );
        return updatedChecklist
    } catch (error) {
        return error;
    }
};

module.exports = {
    getAllChecklist,
    getChecklist,
    createChecklist,
    deleteChecklist,
    updateChecklist,
  };