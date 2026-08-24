import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function JobListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    try {
      const response = await api.get("/jobs");

      const data = response.data.data;

      setListings(
        Array.isArray(data) ? data : data.jobListings || data.listings || [],
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function deleteListing(id) {
    if (!window.confirm("Delete this saved job listing?")) {
      return;
    }

    try {
      await api.delete(`/jobs/${id}`);

      setListings((previous) =>
        previous.filter((listing) => listing.id !== id),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete job listing");
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading job listings...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Saved Jobs</h1>

          <p className="page-subtitle">
            Keep interesting opportunities for later.
          </p>
        </div>

        <Link to="/job-listings/new">
          <button>+ Save Job</button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="empty-card">
          <h2>No saved jobs</h2>

          <p>Save interesting job listings before applying.</p>

          <Link to="/job-listings/new">
            <button>Save Your First Job</button>
          </Link>
        </div>
      ) : (
        <div className="company-grid">
          {listings.map((listing) => (
            // <div className="company-card" key={listing.id}>
            //   <div className="company-card-top">
            //     <div className="company-avatar">
            //       {listing.title?.charAt(0).toUpperCase()}
            //     </div>

            //     <div>
            //       <h2>{listing.title}</h2>

            //       <p>{listing.Company?.name || "Company"}</p>
            //     </div>
            //   </div>

            //   <div className="company-info">
            //     {listing.location && <p>📍 {listing.location}</p>}

            //     {listing.source && <p>🔗 {listing.source}</p>}
            //   </div>

            //   <div className="company-actions">
            //     {listing.jobUrl && (
            //       <a href={listing.jobUrl} target="_blank" rel="noreferrer">
            //         <button>View Job</button>
            //       </a>
            //     )}

            //     <button
            //       className="danger-btn"
            //       onClick={() => deleteListing(listing.id)}
            //     >
            //       Delete
            //     </button>
            //   </div>
            // </div>

            <div className="company-card" key={listing.id}>
              <div className="company-card-top">
                <div className="company-avatar">
                  {listing.title?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2>{listing.title}</h2>

                  <p>{listing.Company?.name || "Company"}</p>
                </div>
              </div>

              <div className="company-info">
                {listing.location && <p>📍 {listing.location}</p>}

                {listing.employmentType && (
                  <p>💼 {listing.employmentType.replace("_", " ")}</p>
                )}

                {listing.source && <p>🔗 {listing.source}</p>}

                {listing.status && <p>📌 Status: {listing.status}</p>}

                {(listing.salaryMin || listing.salaryMax) && (
                  <p>
                    💰 ₹{listing.salaryMin || 0}
                    {" - "}₹{listing.salaryMax || "Open"}
                  </p>
                )}
              </div>

              {listing.description && (
                <p className="job-description">{listing.description}</p>
              )}

              <div className="company-actions">
                {listing.jobUrl && (
                  <a href={listing.jobUrl} target="_blank" rel="noreferrer">
                    <button>View Job</button>
                  </a>
                )}

                <button
                  className="danger-btn"
                  onClick={() => deleteListing(listing.id)}
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

export default JobListings;
