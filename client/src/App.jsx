
import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [employees, setEmployees] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        department: "",
        salary: ""
    });

    const [message, setMessage] = useState("");

    // Get all employees
    const loadEmployees = async () => {
        try {
            const response = await fetch("/api/employees");
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Add employee
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const isEditing = editingId !== null;

        const response = await fetch(
            isEditing
                ? `/api/employees/${editingId}`
                : "/api/employees",
            {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        setMessage(
            isEditing
                ? "Employee updated successfully!"
                : "Employee added successfully!"
        );

        setForm({
            name: "",
            email: "",
            department: "",
            salary: ""
        });

        setEditingId(null);

        loadEmployees();

    } catch (error) {
        setMessage(error.message);
    }
};
const handleEdit = (employee) => {
    setEditingId(employee.id);

    setForm({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        salary: employee.salary
    });
};
const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`/api/employees/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        setMessage("Employee deleted successfully!");

        loadEmployees();

    } catch (error) {
        setMessage(error.message);
    }
};

    return (
        <div className="app-container">
            <h1>Employee Management System</h1>

            <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>

           <form onSubmit={handleSubmit} className="employee-form">
                <input
                    name="name"
                    placeholder="Employee Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    name="department"
                    placeholder="Department"
                    value={form.department}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    name="salary"
                    type="number"
                    placeholder="Salary"
                    value={form.salary}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button type="submit">
    {editingId ? "Update Employee" : "Add Employee"}
</button>
{editingId && (
    <button
        type="button"
        onClick={() => {
            setEditingId(null);
            setForm({
                name: "",
                email: "",
                department: "",
                salary: ""
            });
        }}
    >
        Cancel
    </button>
)}
            </form>

            <p>{message}</p>

            <hr />

            <h2>Employee List ({employees.length})</h2>

            {employees.map(employee => (
                <div key={employee.id} className="employee-card">
                    <h3>{employee.name}</h3>
                    <p>Email: {employee.email}</p>
                    <p>Department: {employee.department}</p>
                    <p>Salary: {employee.salary}</p>
                    <button onClick={() => handleEdit(employee)}>
    Edit
</button>
<button onClick={() => handleDelete(employee.id)}>
    Delete
</button>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default App;
