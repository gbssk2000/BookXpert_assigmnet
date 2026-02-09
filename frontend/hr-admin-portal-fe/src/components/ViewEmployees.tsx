import { useState, useEffect } from "react";
import api from "../api/axios";


interface Employee {
  id: number;
  name: string;
  email: string;
  phoneNo: number;
  department: string;  // Backend returns as string ("HR", "IT", etc)
  salary: number;
}

interface EmployeeEdit {
  id: number;
  name: string;
  email: string;
  phoneNo: number;
  department: number;  // For edit form, use number (enum)
  salary: number;
}

const ViewEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<EmployeeEdit | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  const departmentToNumber: { [key: string]: number } = {
    "HR": 1,
    "IT": 2,
    "Finance": 3,
    "Sales": 4,
    "Operations": 5
  };

  const fetchEmployees = () => {
    api.get("/employees").then(response => setEmployees(response.data));
  };
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee: Employee) => {
    setEditingEmployee({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      phoneNo: employee.phoneNo,
      department: departmentToNumber[employee.department] || 1,  // Convert string to number
      salary: employee.salary
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    try {
      await api.put(`/employees/${editingEmployee.id}`, {
        name: editingEmployee.name,
        email: editingEmployee.email,
        phoneNo: editingEmployee.phoneNo,
        salary: editingEmployee.salary,
        department: editingEmployee.department
      });
      alert("Employee updated successfully!");
      setIsEditModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error: any) {
      console.error("Error updating employee:", error);
      alert(`Failed to update employee: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/employees/${id}`);
      alert("Employee deleted successfully!");
      fetchEmployees();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      alert(`Failed to delete employee: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedEmployees(new Set(filteredEmployees.map(e => e.id)));
    } else {
      setSelectedEmployees(new Set());
    }
  };

  const handleSelectEmployee = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedEmployees);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedEmployees(newSelected);
    setSelectAll(false);
  };

  const handleDeleteSelected = async () => {
    if (selectedEmployees.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedEmployees.size} selected employee(s)?`)) return;

    try {
      // Delete each selected employee
      await Promise.all(
        Array.from(selectedEmployees).map(id => api.delete(`/employees/${id}`))
      );
      alert(`${selectedEmployees.size} employee(s) deleted successfully!`);
      setSelectedEmployees(new Set());
      setSelectAll(false);
      fetchEmployees();
    } catch (error: any) {
      console.error("Error deleting employees:", error);
      alert(`Failed to delete selected employees: ${error.response?.data?.message || error.message}`);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    `${emp.name} ${emp.email} ${emp.department}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none" }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>Total Employees</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{employees.length}</p>
        </div>
        
        <div className="card" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none" }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>Departments</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{new Set(employees.map(e => e.department)).size}</p>
        </div>
      </div>

      {/* Search Bar and Actions */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "flex-end" }}>
        <div className="card" style={{ flex: 1, marginBottom: 0 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              placeholder="🔍 Search employees by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: "1rem" }}
            />
          </div>
        </div>
        {selectedEmployees.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            style={{
              padding: "0.875rem 1.5rem",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              border: "none",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              marginBottom: "0.5rem"
            }}
          >
            🗑️ Delete Selected ({selectedEmployees.size})
          </button>
        )}
      </div>

      {/* Employees Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
              <th style={{ width: "40px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  style={{ cursor: "pointer", width: "18px", height: "18px" }}
                  title="Select all employees"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td style={{ fontWeight: 600 }}>{employee.name}</td>
                <td style={{ color: "var(--text-secondary)" }}>{employee.email}</td>
                <td>{employee.phoneNo}</td>
                {/* <td>{departmentNames[employee.department]}</td> */}
                <td>{employee.department}</td>
                <td>${employee.salary.toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleEdit(employee)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid var(--accent-primary)",
                      color: "var(--accent-primary)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      marginRight: "0.5rem",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid var(--danger)",
                      color: "var(--danger)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </button>
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.has(employee.id)}
                    onChange={(e) => handleSelectEmployee(employee.id, e.target.checked)}
                    style={{ cursor: "pointer", width: "18px", height: "18px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingEmployee && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "2rem"
        }}>
          <div className="card" style={{ maxWidth: "600px", width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem" }}>Edit Employee</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingEmployee(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "0.5rem"
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="number"
                  value={editingEmployee.phoneNo}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, phoneNo: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  value={editingEmployee.department}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, department: Number(e.target.value) })}
                  required
                >
                  <option value="1">HR</option>
                  <option value="2">IT</option>
                  <option value="3">Finance</option>
                  <option value="4">Sales</option>
                  <option value="5">Operations</option>
                </select>
              </div>

              <div className="form-group">
                <label>Salary *</label>
                <input
                  type="number"
                  value={editingEmployee.salary}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: Number(e.target.value) })}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button type="submit" className="btn">
                  Update Employee
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ background: "transparent", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingEmployee(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployees;
