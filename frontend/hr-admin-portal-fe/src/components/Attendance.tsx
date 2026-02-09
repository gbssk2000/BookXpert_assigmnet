import { useState, useEffect } from "react";
import api from "../api/axios";

interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  phoneNo: number;
  salary: number;
}

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [activeTab, setActiveTab] = useState<"individual" | "bulk">("individual");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());

  // Individual marking
  const [newAttendance, setNewAttendance] = useState({
    employeeId: 0,
    checkInTime: new Date().toISOString().slice(0, 16),
    checkOutTime: "",
    status: "Present"
  });

  // Bulk marking
  const [bulkAttendance, setBulkAttendance] = useState({
    checkInTime: new Date().toISOString().slice(0, 16),
    checkOutTime: "",
    status: "Present"
  });

  const attendanceStatuses = ["Present", "Absent", "Late", "Leave"];
  const departments = ["HR", "IT", "Finance", "Sales", "Operations"];

  const fetchAttendance = async () => {
    try {
      setLoadingRecords(true);
      const response = await api.get("/attendance");
      setAttendanceRecords(response.data);
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
      alert("Failed to fetch attendance records");
    } finally {
      setLoadingRecords(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAttendance.employeeId === 0) {
      alert("Please select an employee");
      return;
    }

    try {
      await api.post("/attendance", {
        employeeId: newAttendance.employeeId,
        checkInTime: new Date(newAttendance.checkInTime).toISOString(),
        checkOutTime: newAttendance.checkOutTime 
          ? new Date(newAttendance.checkOutTime).toISOString() 
          : null,
        status: newAttendance.status
      });
      alert("Attendance marked successfully!");
      setNewAttendance({
        employeeId: 0,
        checkInTime: new Date().toISOString().slice(0, 16),
        checkOutTime: "",
        status: "Present"
      });
      fetchAttendance();
    } catch (error: any) {
      console.error("Error marking attendance:", error);
      alert(`Failed to mark attendance: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleBulkMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetEmployees: number[] = [];
    if (departmentFilter === "all") {
      targetEmployees = Array.from(selectedEmployees);
    } else {
      const deptEmployees = employees
        .filter(emp => emp.department === departmentFilter)
        .map(emp => emp.id);
      targetEmployees = Array.from(selectedEmployees.size > 0 ? selectedEmployees : new Set(deptEmployees));
    }

    if (targetEmployees.length === 0) {
      alert("Please select at least one employee");
      return;
    }

    const confirmBulk = window.confirm(`Mark attendance for ${targetEmployees.length} employee(s)?`);
    if (!confirmBulk) return;

    try {
      const promises = targetEmployees.map(employeeId =>
        api.post("/attendance", {
          employeeId,
          checkInTime: new Date(bulkAttendance.checkInTime).toISOString(),
          checkOutTime: bulkAttendance.checkOutTime 
            ? new Date(bulkAttendance.checkOutTime).toISOString() 
            : null,
          status: bulkAttendance.status
        })
      );

      await Promise.all(promises);
      alert(`✅ Attendance marked for ${targetEmployees.length} employee(s)!`);
      setSelectedEmployees(new Set());
      fetchAttendance();
    } catch (error: any) {
      console.error("Error marking bulk attendance:", error);
      alert(`Failed to mark bulk attendance: ${error.message}`);
    }
  };

  const toggleEmployeeSelection = (employeeId: number) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const toggleSelectAllDepartment = () => {
    if (departmentFilter === "all") return;
    
    const deptEmployees = employees
      .filter(emp => emp.department === departmentFilter)
      .map(emp => emp.id);
    
    const allSelected = deptEmployees.every(id => selectedEmployees.has(id));
    
    if (allSelected) {
      setSelectedEmployees(new Set([...selectedEmployees].filter(id => !deptEmployees.includes(id))));
    } else {
      setSelectedEmployees(new Set([...selectedEmployees, ...deptEmployees]));
    }
  };

  const filteredEmployees = departmentFilter === "all"
    ? employees
    : employees.filter(emp => emp.department === departmentFilter);

  const presentCount = attendanceRecords.filter(r => r.status === "Present").length;
  const absentCount = attendanceRecords.filter(r => r.status === "Absent").length;
  const lateCount = attendanceRecords.filter(r => r.status === "Late").length;

  return (
    <div>
      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card" style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "none" }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>Present</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{presentCount}</p>
        </div>
        
        <div className="card" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "none" }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>Absent</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{absentCount}</p>
        </div>
        
        <div className="card" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none" }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>Late</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{lateCount}</p>
        </div>
        
        <div className="card" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none" }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>Attendance Rate</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
            {attendanceRecords.length > 0 
              ? Math.round(((presentCount + lateCount) / attendanceRecords.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card" style={{ marginBottom: "1.5rem", padding: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <button
            onClick={() => setActiveTab("individual")}
            style={{
              padding: "0.75rem 1.5rem",
              background: activeTab === "individual" ? "rgba(59, 130, 246, 0.2)" : "transparent",
              border: "none",
              borderBottom: activeTab === "individual" ? "2px solid #3b82f6" : "none",
              color: activeTab === "individual" ? "#3b82f6" : "rgba(255,255,255,0.6)",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            👤 Individual
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            style={{
              padding: "0.75rem 1.5rem",
              background: activeTab === "bulk" ? "rgba(59, 130, 246, 0.2)" : "transparent",
              border: "none",
              borderBottom: activeTab === "bulk" ? "2px solid #3b82f6" : "none",
              color: activeTab === "bulk" ? "#3b82f6" : "rgba(255,255,255,0.6)",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            👥 Bulk Mark ({selectedEmployees.size})
          </button>
        </div>
      </div>

      {/* Individual Marking */}
      {activeTab === "individual" && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>📋 Mark Individual Attendance</h3>
          <form onSubmit={handleMarkAttendance}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group">
                <label>Employee *</label>
                <select
                  value={newAttendance.employeeId}
                  onChange={(e) => setNewAttendance({ ...newAttendance, employeeId: Number(e.target.value) })}
                  required
                >
                  <option value="0">Select an employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  value={newAttendance.status}
                  onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
                  required
                >
                  {attendanceStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Check In Time *</label>
                <input
                  type="datetime-local"
                  value={newAttendance.checkInTime}
                  onChange={(e) => setNewAttendance({ ...newAttendance, checkInTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Check Out Time</label>
                <input
                  type="datetime-local"
                  value={newAttendance.checkOutTime}
                  onChange={(e) => setNewAttendance({ ...newAttendance, checkOutTime: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn" style={{ marginTop: "1rem" }}>
              ✓ Mark Attendance
            </button>
          </form>
        </div>
      )}

      {/* Bulk Marking */}
      {activeTab === "bulk" && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>👥 Mark Bulk Attendance</h3>
          
          {/* Department Filter */}
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "rgba(59, 130, 246, 0.1)", borderRadius: "8px" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <label style={{ fontWeight: 600 }}>Filter by Department:</label>
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setSelectedEmployees(new Set());
                }}
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "6px",
                  color: "rgba(255, 255, 255, 0.9)",
                  cursor: "pointer"
                }}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              {departmentFilter !== "all" && (
                <button
                  type="button"
                  onClick={toggleSelectAllDepartment}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "rgba(59, 130, 246, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.5)",
                    borderRadius: "6px",
                    color: "#3b82f6",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.9rem"
                  }}
                >
                  {filteredEmployees.every(emp => selectedEmployees.has(emp.id)) ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            {loadingEmployees ? (
              <p style={{ color: "rgba(255,255,255,0.6)" }}>Loading employees...</p>
            ) : filteredEmployees.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.6)" }}>No employees found in this department</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                {filteredEmployees.map(emp => (
                  <label
                    key={emp.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.75rem",
                      background: selectedEmployees.has(emp.id) ? "rgba(16, 185, 129, 0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${selectedEmployees.has(emp.id) ? "rgba(16, 185, 129, 0.3)" : "rgba(59, 130, 246, 0.1)"}`,
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.has(emp.id)}
                      onChange={() => toggleEmployeeSelection(emp.id)}
                      style={{ marginRight: "0.5rem", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.9rem" }}>{emp.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Bulk Attendance Form */}
          <form onSubmit={handleBulkMarkAttendance}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={bulkAttendance.status}
                  onChange={(e) => setBulkAttendance({ ...bulkAttendance, status: e.target.value })}
                  required
                >
                  {attendanceStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Check In Time *</label>
                <input
                  type="datetime-local"
                  value={bulkAttendance.checkInTime}
                  onChange={(e) => setBulkAttendance({ ...bulkAttendance, checkInTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Check Out Time</label>
                <input
                  type="datetime-local"
                  value={bulkAttendance.checkOutTime}
                  onChange={(e) => setBulkAttendance({ ...bulkAttendance, checkOutTime: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn" style={{ marginTop: "1rem" }}>
              ✓ Mark Attendance for {selectedEmployees.size > 0 ? selectedEmployees.size : "Selected"} Employee(s)
            </button>
          </form>
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="card">
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>📊 Attendance Records</h3>
        {loadingRecords ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading records...</p>
        ) : attendanceRecords.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>No attendance records found</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td style={{ fontWeight: 600 }}>{record.employeeName}</td>
                    <td>{record.department}</td>
                    <td>{new Date(record.checkInTime).toLocaleString()}</td>
                    <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : "—"}</td>
                    <td>
                      <span 
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          backgroundColor: record.status === "Present" 
                            ? "rgba(16, 185, 129, 0.2)"
                            : record.status === "Absent"
                            ? "rgba(239, 68, 68, 0.2)"
                            : record.status === "Late"
                            ? "rgba(245, 158, 11, 0.2)"
                            : "rgba(107, 114, 128, 0.2)",
                          color: record.status === "Present"
                            ? "#10b981"
                            : record.status === "Absent"
                            ? "#ef4444"
                            : record.status === "Late"
                            ? "#f59e0b"
                            : "#6b7280"
                        }}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
