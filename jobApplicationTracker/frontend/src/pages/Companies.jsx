import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Companies() {
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadCompanies() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/companies");

      /*
       * Depending on backend response,
       * companies may be inside:
       *
       * response.data.data
       *
       * OR
       *
       * response.data.data.companies
       */

      const data = response.data.data;

      setCompanies(Array.isArray(data) ? data : data.companies || []);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  async function deleteCompany(companyId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/companies/${companyId}`);

      // Remove deleted company immediately
      setCompanies((previousCompanies) =>
        previousCompanies.filter((company) => company.id !== companyId),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete company");
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Companies</h1>

          <p className="page-subtitle">Manage companies you're applying to.</p>
        </div>

        <Link to="/companies/new">
          <button>+ Add Company</button>
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      {companies.length === 0 ? (
        <div className="empty-card">
          <h2>No companies yet</h2>

          <p>Add your first company to start tracking job applications.</p>

          <Link to="/companies/new">
            <button>Add Your First Company</button>
          </Link>
        </div>
      ) : (
        <div className="company-grid">
          {companies.map((company) => (
            <div className="company-card" key={company.id}>
              <div className="company-card-top">
                <div className="company-avatar">
                  {company.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2>{company.name}</h2>

                  <p>{company.industry || "Industry not specified"}</p>
                </div>
              </div>

              <div className="company-info">
                {company.location && <p>📍 {company.location}</p>}

                {company.companySize && <p>👥 {company.companySize}</p>}

                {company.contactEmail && <p>✉️ {company.contactEmail}</p>}

                {company.website && <p>🌐 {company.website}</p>}
              </div>

              {company.notes && (
                <div className="company-notes">
                  <strong>Notes</strong>

                  <p>{company.notes}</p>
                </div>
              )}

              <div className="company-actions">
                <Link to={`/companies/${company.id}/edit`}>
                  <button className="secondary-btn">Edit</button>
                </Link>

                <button
                  className="danger-btn"
                  onClick={() => deleteCompany(company.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Companies;
