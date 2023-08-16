const { pool } = require("../db");
const bcrypt = require('bcrypt');
const uuid = require("uuid")
const jwt = require('jsonwebtoken');
const key = "abdurakhmonovsharif4413"
class AuthController {
    async login(req, res) {
        const { username, password } = req.body;
        try {
            const query = "SELECT * FROM users WHERE username = $1";
            const values = [username];
            const result = await pool.query(query, values);
            const userResult = result.rows[0];

            // Check if the user exists
            if (!userResult) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const passwordMatch = await bcrypt.compare(password, userResult.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const user = {
                id: userResult.id,
                username: userResult.username
            };

            const token = jwt.sign({ id: user.id }, key, { expiresIn: '1h' });
            res.json({ user, token });
        } catch (error) {
            console.error("Error retrieving passwords:", error);
            res.status(500).json({ error: "Failed to retrieve passwords" });
        }
    }
    async register(req, res) {
        const { username, password } = req.body;
        try {
            const usernameQuery = "SELECT id FROM users WHERE username = $1";
            const usernameValues = [username];
            const usernameResult = await pool.query(usernameQuery, usernameValues);
            const existingUsername = usernameResult.rows[0];
            // Username already exists
            if (existingUsername) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const query =
                "INSERT INTO users (id,username,password) VALUES ($1, $2,$3) RETURNING id, username";
            const id = uuid.v4();
            const values = [id, username, hashedPassword];
            const result = await pool.query(query, values);
            const createdUser = result.rows[0];

            const user = {
                id: createdUser.id,
                username: createdUser.username,
            };
            const token = jwt.sign({ id: user.id }, key, { expiresIn: '1h' });
            res.json({ user, token });
        } catch (error) {
            console.error("Error creating user:", error);
            res
                .status(500)
                .json({ message: "An error occurred while creating the user" });
        }
    }
    async getUser(req, res) {
        try {
            const headers = req.headers;
            const token = headers.authorization;

            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            jwt.verify(token, key, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid token' });
                }
                const userId = decoded.id;
                const query = "SELECT id,username FROM users WHERE id = $1";
                const values = [userId];
                const result = await pool.query(query, values);
                const userResult = result.rows[0];
                res.json({ status: 'success', user: userResult });
            });
        } catch (error) {
            console.error("Error getting user:", error);
            res.status(500).json({ message: "An error occurred while getting the user" });
        }
    }
}
module.exports = new AuthController()