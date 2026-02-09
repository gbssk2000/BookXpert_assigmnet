import { useState } from "react";
import api from "../api/axios";

const Reports = () => {
  const [reportType, setReportType] = useState("employee-directory");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(false);

  const getReportFileName = (type: string, format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${type}_report_${timestamp}.${format}`;
  };

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateReport = async () => {
    if (!reportType) {
      alert("Please select a report type");
      return;
    }

    if ((reportType === "attendance") && (!dateRange.from || !dateRange.to)) {
      alert("Please select both From and To dates for attendance reports");
      return;
    }

    try {
      setLoading(true);
      let endpoint = "";
      let fileName = "";

      if (reportType === "employee-directory") {
        endpoint = `/reports/employee-directory/${reportFormat}`;
        fileName = getReportFileName("employee-directory", reportFormat);
      } else if (reportType === "attendance") {
        endpoint = `/reports/attendance/${reportFormat}?startDate=${dateRange.from}&endDate=${dateRange.to}`;
        fileName = getReportFileName("attendance", reportFormat);
      } else if (reportType === "department") {
        endpoint = `/reports/departments/${reportFormat}`;
        fileName = getReportFileName("department", reportFormat);
      } else if (reportType === "salary") {
        endpoint = `/reports/salary/${reportFormat}`;
        fileName = getReportFileName("salary", reportFormat);
      }

      const response = await api.get(endpoint, {
        responseType: 'blob'
      });

      downloadFile(response.data, fileName);
      alert("Report downloaded successfully!");
    } catch (error: any) {
      console.error("Error generating report:", error);
      alert(`Failed to generate report: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Report Generation Card */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "2rem", fontSize: "1.5rem" }}>📋 Generate Reports</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div className="form-group">
            <label>Report Type *</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="employee-directory">Employee Directory</option>
              <option value="attendance">Attendance Report</option>
              <option value="department">Department Report</option>
              <option value="salary">Salary Report</option>
            </select>
          </div>

          <div className="form-group">
            <label>Report Format *</label>
            <select value={reportFormat} onChange={(e) => setReportFormat(e.target.value)}>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>

          {reportType === "attendance" && (
            <>
              <div className="form-group">
                <label>From Date *</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>To Date *</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
            </>
          )}
        </div>

        <button 
          className="btn" 
          onClick={generateReport} 
          style={{ marginTop: "1rem" }}
          disabled={loading}
        >
          {loading ? "⏳ Generating..." : "📊 Generate & Download Report"}
        </button>
      </div>

      {/* Report Info Cards */}
      <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Available Reports</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
        <div className="card" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>👥 Employee Directory</h4>
          <p style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "1rem" }}>
            Complete list of all employees with details
          </p>
          <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>Formats: PDF, Excel</p>
        </div>

        <div className="card" style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "none" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>📅 Attendance Report</h4>
          <p style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "1rem" }}>
            Attendance records for a date range
          </p>
          <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>Formats: PDF, Excel</p>
        </div>

        <div className="card" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>🏢 Department Report</h4>
          <p style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "1rem" }}>
            Department-wise employee breakdown
          </p>
          <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>Formats: PDF, Excel</p>
        </div>

        <div className="card" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", border: "none" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>💰 Salary Report</h4>
          <p style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "1rem" }}>
            Comprehensive salary information by department
          </p>
          <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>Formats: PDF, Excel</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
