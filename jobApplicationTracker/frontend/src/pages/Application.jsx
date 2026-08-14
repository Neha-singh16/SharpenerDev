import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Applications() {
  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);

  async function loadApplications() {
    try {
      setLoading(true);

      const response = await api.get("/applications", {
        params: {
          search: search || undefined,
          status: status || undefined,
          page: 1,
          limit: 10,
        },
      });

      setApplications(response.data.data.applications);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, [status]);

  function handleSearch(e) {
    e.preventDefault();

    loadApplications();
  }

  async function updateStatus(applicationId, newStatus) {
    try {
      await api.put(`/applications/${applicationId}`, {
        status: newStatus,
      });

      // Reload applications after update
      loadApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  }

  return (
    <div className="dashboard">
      <h1>My Applications</h1>

      <Link to="/applications/new">
        <button>+ Add Application</button>
      </Link>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search company or job title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>

          <option value="APPLIED">Applied</option>

          <option value="INTERVIEW">Interview</option>

          <option value="OFFERED">Offered</option>

          <option value="REJECTED">Rejected</option>
        </select>

        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="applications">
          {applications.map((application) => (
            <div className="application-card" key={application.id}>
              <h3>{application.jobTitle}</h3>

              <p>{application.Company?.name}</p>

              <p>
                Applied: {new Date(application.appliedAt).toLocaleDateString()}
              </p>

              {/* Status belongs to THIS application */}
              <label>Status:</label>

              <select
                value={application.status}
                onChange={(e) => updateStatus(application.id, e.target.value)}
              >
                <option value="APPLIED">Applied</option>

                <option value="INTERVIEW">Interview</option>

                <option value="OFFERED">Offered</option>

                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;
