// import { useEffect, useState } from "react";
// import api from "../services/api";
// import { Link } from "react-router-dom";

// function Applications() {
//   const [applications, setApplications] = useState([]);

//   const [search, setSearch] = useState("");

//   const [status, setStatus] = useState("");

//   const [loading, setLoading] = useState(true);

//   async function loadApplications() {
//     try {
//       setLoading(true);

//       const response = await api.get("/applications", {
//         params: {
//           search: search || undefined,
//           status: status || undefined,
//           page: 1,
//           limit: 10,
//         },
//       });

//       setApplications(response.data.data.applications);
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadApplications();
//   }, [status]);

//   function handleSearch(e) {
//     e.preventDefault();

//     loadApplications();
//   }

//   async function updateStatus(applicationId, newStatus) {
//     try {
//       await api.put(`/applications/${applicationId}`, {
//         status: newStatus,
//       });

//       loadApplications();
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to update status");
//     }
//   }

//   return (
//     <div className="dashboard">
//       <h1>My Applications</h1>

//       <Link to="/applications/new">
//         <button>+ Add Application</button>
//       </Link>

//       <form onSubmit={handleSearch}>
//         <input
//           type="text"
//           placeholder="Search company or job title"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select value={status} onChange={(e) => setStatus(e.target.value)}>
//           <option value="">All Statuses</option>
//           <option value="APPLIED">Applied</option>
//           <option value="INTERVIEW">Interview</option>
//           <option value="OFFERED">Offered</option>
//           <option value="REJECTED">Rejected</option>
//         </select>

//         <button type="submit">Search</button>
//       </form>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="applications">
//           {applications.map((application) => (
//             <div className="application-card" key={application.id}>
//               <h3>{application.jobTitle}</h3>

//               <p>{application.Company?.name}</p>

//               <p>
//                 Applied:{" "}
//                 {new Date(application.appliedAt).toLocaleDateString()}
//               </p>

//               <label>Status:</label>

//               <select
//                 value={application.status}
//                 onChange={(e) =>
//                   updateStatus(application.id, e.target.value)
//                 }
//               >
//                 <option value="APPLIED">Applied</option>
//                 <option value="INTERVIEW">Interview</option>
//                 <option value="OFFERED">Offered</option>
//                 <option value="REJECTED">Rejected</option>
//               </select>

//               <Link
//                 to={`/applications/${application.id}`}
//                 className="view-details-link"
//               >
//                 View Details →
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Applications;

import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Applications() {
  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications", {
        params: {
          search: search || undefined,
          status: status || undefined,
          from: from || undefined,
          to: to || undefined,
          page: 1,
          limit: 10,
        },
      });

      setApplications(response.data.data.applications || []);
    } catch (error) {
      console.error(error.response?.data || error.message);

      setError(error.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, [status]);

  function handleSearch(e) {
    e.preventDefault();

    if (from && to && from > to) {
      alert("From date cannot be later than To date.");

      return;
    }

    loadApplications();
  }

  function handleDateChange() {
    if (from && to && from > to) {
      alert("From date cannot be later than To date.");

      return;
    }

    loadApplications();
  }

  async function updateStatus(applicationId, newStatus) {
    try {
      await api.put(`/applications/${applicationId}`, {
        status: newStatus,
      });

      loadApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  }

  function clearFilters() {
    setSearch("");
    setStatus("");
    setFrom("");
    setTo("");

    /*
     * We explicitly load without filters
     * because React state updates are asynchronous.
     */
    loadApplicationsWithoutFilters();
  }

  async function loadApplicationsWithoutFilters() {
    try {
      setLoading(true);

      const response = await api.get("/applications", {
        params: {
          page: 1,
          limit: 10,
        },
      });

      setApplications(response.data.data.applications || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="page-header">
        <div>
          <h1>My Applications</h1>

          <p className="page-subtitle">
            Search and filter your job applications.
          </p>
        </div>

        <Link to="/applications/new">
          <button>+ Add Application</button>
        </Link>
      </div>

      {/* =================================================
          SEARCH & FILTERS
      ================================================== */}

      <form className="application-filters" onSubmit={handleSearch}>
        {/* SEARCH */}

        <div className="filter-field search-field">
          <label>Search</label>

          <input
            type="text"
            placeholder="Company or job title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATUS */}

        <div className="filter-field">
          <label>Status</label>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>

            <option value="APPLIED">Applied</option>

            <option value="INTERVIEW">Interview</option>

            <option value="OFFERED">Offered</option>

            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* FROM DATE */}

        <div className="filter-field">
          <label>From Date</label>

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        {/* TO DATE */}

        <div className="filter-field">
          <label>To Date</label>

          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        {/* SEARCH BUTTON */}

        <button type="submit">Search</button>

        {/* CLEAR */}

        <button type="button" className="secondary-btn" onClick={clearFilters}>
          Clear
        </button>
      </form>

      {/* =================================================
          ERROR
      ================================================== */}

      {error && <p className="error">{error}</p>}

      {/* =================================================
          APPLICATIONS
      ================================================== */}

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <div className="empty-card">
          <h2>No applications found</h2>

          <p>Try changing your search or filter criteria.</p>
        </div>
      ) : (
        <div className="applications">
          {applications.map((application) => (
            <div className="application-card" key={application.id}>
              <h3>{application.jobTitle}</h3>

              <p>{application.Company?.name}</p>

              <p>
                Applied: {new Date(application.appliedAt).toLocaleDateString()}
              </p>

              <div>
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

              <Link
                to={`/applications/${application.id}`}
                className="view-details-link"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;
