import { useState } from "react";
import api from "../api/axios";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    phone: 0,
    department: 0,
    salary: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "department" || name === "salary" || name === "phone" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phone,
        salary: formData.salary,
        department: formData.department
      };
      console.log("Employee Data:", payload);
      const response = await api.post("/employees", payload);
      console.log("Response:", response.data);
      alert("Employee added successfully!");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: 0,
        department: 0,
        salary: 0,
      });
    } catch (error: any) {
      console.error("Error adding employee:", error);
      alert(`Failed to add employee: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "2rem", fontSize: "1.5rem" }}>Add New Employee</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter first name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="employee@company.com"
            />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="0">Select Department</option>
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
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              placeholder="50000"
            />
          </div>
        </div>

        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <button type="submit" className="btn">
            Add Employee
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: "transparent", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
            onClick={() => setFormData({
              name:"",
              email: "",
              phone: 0,
              department: 0,
              salary: 0,
            })}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
