const { pool } = require("../db");

class TodoController {
    async getTodosById(req, res) {
        const userId = req.params.id
        try {
            const queryResult = await pool.query('SELECT * FROM todos WHERE user_id = $1', [userId]);
            const todos = queryResult.rows;
            res.status(200).json({ todos });
        } catch (error) {
            console.error("Error getting todos:", error);
            res.status(500).json({ error: "Failed to get todos" });
        }
    }

    async postTodo(req, res) {
        const { id, title, user_id } = req.body;
        try {
            // Check if the user_id exists in the users table
            const userCheckQuery = "SELECT * FROM users WHERE id = $1";
            const userCheckResult = await pool.query(userCheckQuery, [user_id]);

            if (userCheckResult.rows.length === 0) {
                return res.status(400).json({ error: "User with the provided user_id does not exist" });
            }

            // Insert the todo into the todos table
            const insertQuery = "INSERT INTO todos (id, title, user_id) VALUES ($1, $2, $3)";
            await pool.query(insertQuery, [id, title, user_id]);

            res.status(200).json({ message: "Todo inserted successfully" });
        } catch (error) {
            console.error("Error inserting todo:", error);
            res.status(500).json({ error: "Failed to insert todo" });
        }
    }


    async deleteTodo(req, res) {
        const id = req.params.id;
        const { user_id } = req.body;
        try {
            const userCheckQuery = "SELECT * FROM users WHERE id = $1";
            const userCheckResult = await pool.query(userCheckQuery, [user_id]);

            if (userCheckResult.rows.length === 0) {
                return res.status(400).json({ error: "User with the provided user_id does not exist" });
            }
            const query = "DELETE FROM todos WHERE id = $1 AND user_id = $2";
            await pool.query(query, [id, user_id]);
            res.status(200).json({ message: "Todo deleted successfully" });
        } catch (error) {
            console.error("Error deleting todo:", error);
            res.status(500).json({ error: "Failed to delete todo" });
        }
    }

    async updateTodoById(req, res) {
        const id = req.params.id;
        const { title, user_id, completed } = req.body;

        try {
            // Check if the user_id exists before proceeding with the update
            const userCheckQuery = "SELECT * FROM users WHERE id = $1";
            const userCheckResult = await pool.query(userCheckQuery, [user_id]);

            if (userCheckResult.rows.length === 0) {
                return res.status(400).json({ error: "User with the provided user_id does not exist" });
            }

            // Perform the todo update
            const updateQuery =
                "UPDATE todos SET title = $1,completed=$2 WHERE id = $3 AND user_id = $4";
            const updateResult = await pool.query(updateQuery, [title, completed, id, user_id]);

            // Check if any rows were affected by the update
            if (updateResult.rowCount === 0) {
                return res.status(404).json({ error: "Todo not found or unauthorized" });
            }

            res.status(200).json({ message: "Todo updated successfully" });
        } catch (error) {
            console.error("Error updating todo:", error);
            res.status(500).json({ error: "Failed to update todo" });
        }
    }


}

module.exports = new TodoController();
