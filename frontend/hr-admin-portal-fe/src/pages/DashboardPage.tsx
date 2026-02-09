import { useState } from "react";
import "../styles/Dashboard.css";
import AddEmployee from "../components/AddEmployee";
import ViewEmployees from "../components/ViewEmployees";
import Attendance from "../components/Attendance";
import Reports from "../components/Reports";

type TabType = "add-employee" | "view-employees" | "attendance" | "reports";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("view-employees");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "add-employee":
        return <AddEmployee />;
      case "view-employees":
        return <ViewEmployees />;
      case "attendance":
        return <Attendance />;
      case "reports":
        return <Reports />;
      default:
        return <ViewEmployees />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>HR Portal</h2>
          <p className="user-badge">Admin</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "view-employees" ? "active" : ""}`}
            onClick={() => setActiveTab("view-employees")}
          >
            <span className="icon">👥</span>
            <span>View Employees</span>
          </button>

          <button
            className={`nav-item ${activeTab === "add-employee" ? "active" : ""}`}
            onClick={() => setActiveTab("add-employee")}
          >
            <span className="icon">➕</span>
            <span>Add Employee</span>
          </button>

          <button
            className={`nav-item ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            <span className="icon">📅</span>
            <span>Attendance</span>
          </button>

          <button
            className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <span className="icon">📊</span>
            <span>Reports</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={logout}>
          <span className="icon">🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <h1>{activeTab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h1>
          <div className="header-actions">
            <span className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
