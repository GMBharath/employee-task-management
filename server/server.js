
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "https://silver-sniffle-6qxqpp5vgvjfr67p-5174.app.github.dev"
}));

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Employee Management API is running!");
});

// GET all employees
app.get("/api/employees", async (req, res) => {
    try {
        const [employees] = await db.query(
            "SELECT * FROM employees"
        );

        res.json(employees);

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "Failed to fetch employees"
        });
    }
});

// POST API - Add a new employee
app.post("/api/employees", async (req, res) => {
    try {
        const { name, email, department, salary } = req.body;

        const sql = `
            INSERT INTO employees
            (name, email, department, salary)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            name,
            email,
            department,
            salary
        ]);

        res.status(201).json({
            message: "Employee added successfully",
            employeeId: result.insertId
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "Failed to add employee"
        });
    }
});
// PUT API - Update employee
app.put("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, department, salary } = req.body;

        const sql = `
            UPDATE employees
            SET name = ?, email = ?, department = ?, salary = ?
            WHERE id = ?
        `;

        const [result] = await db.query(sql, [
            name,
            email,
            department,
            salary,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee updated successfully"
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "Failed to update employee"
        });
    }
});
// DELETE API - Delete employee
app.delete("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM employees WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee deleted successfully"
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "Failed to delete employee"
        });
    }
});
// GET employee by ID
app.get("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [employees] = await db.query(
            "SELECT * FROM employees WHERE id = ?",
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json(employees[0]);

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "Failed to fetch employee"
        });
    }
});
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
