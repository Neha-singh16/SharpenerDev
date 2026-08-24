// import { useEffect, useState } from "react";
// import api from "../services/api";

// import { Link } from "react-router-dom";

// function Dashboard() {
//   const [dashboard, setDashboard] = useState(null);

//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   async function loadDashboard() {
//     try {
//       const response = await api.get("/dashboard");

//       setDashboard(response.data.data);
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to load dashboard");
//     }
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (!dashboard) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="dashboard">
//       {/* <h1>Job Search Dashboard</h1> */}
//       <div className="dashboard-header">
//         <div>
//           <h1>Job Search Dashboard</h1>

//           <p className="dashboard-subtitle">
//             Track applications, interviews and offers in one place.
//           </p>
//         </div>

//         <Link to="/applications/new">
//           <button>+ Add Application</button>
//         </Link>
//       </div>

//       <div className="stats">
//         <div className="stat-card">
//           <h3>Total Applications</h3>
//           <p>{dashboard.totalApplications}</p>
//         </div>

//         <div className="stat-card">
//           <h3>Applied</h3>
//           <p>{dashboard.statusCounts.APPLIED}</p>
//         </div>

//         <div className="stat-card">
//           <h3>Interviews</h3>
//           <p>{dashboard.statusCounts.INTERVIEW}</p>
//         </div>

//         <div className="stat-card">
//           <h3>Offers</h3>
//           <p>{dashboard.statusCounts.OFFERED}</p>
//         </div>

//         <div className="stat-card">
//           <h3>Rejected</h3>
//           <p>{dashboard.statusCounts.REJECTED}</p>
//         </div>

//         <div className="stat-card">
//           <h3>Response Rate</h3>
//           <p>{dashboard.responseRate}%</p>
//         </div>
//       </div>

//       <h2>Recent Applications</h2>

//       <div className="applications">
//         {dashboard.recentApplications.map((application) => (
//           <div className="application-card" key={application.id}>
//             <h3>{application.jobTitle}</h3>

//             <p>{application.Company?.name}</p>

//             <span>{application.status}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from "react";
// import api from "../services/api";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const response = await api.get("/dashboard");

      setDashboard(response.data.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to load dashboard");
    }
  }

  if (error) {
    return (
      <div className="dashboard">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard">
        <p>Loading...</p>
      </div>
    );
  }

  const statusChartData = [
    {
      status: "Applied",
      applications: dashboard.statusCounts.APPLIED || 0,
    },
    {
      status: "Interview",
      applications: dashboard.statusCounts.INTERVIEW || 0,
    },
    {
      status: "Offered",
      applications: dashboard.statusCounts.OFFERED || 0,
    },
    {
      status: "Rejected",
      applications: dashboard.statusCounts.REJECTED || 0,
    },
  ];

  return (
    <div className="dashboard">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="dashboard-header">
        <div>
          <h1>Job Search Dashboard</h1>

          <p className="dashboard-subtitle">
            Track applications, interviews and offers in one place.
          </p>
        </div>

        <Link to="/applications/new">
          <button>+ Add Application</button>
        </Link>
      </div>

      {/* =================================================
          STATISTICS
      ================================================== */}

      <div className="stats">
        <div className="stat-card">
          <h3>Total Applications</h3>

          <p>{dashboard.totalApplications}</p>
        </div>

        <div className="stat-card">
          <h3>Applied</h3>

          <p>{dashboard.statusCounts.APPLIED}</p>
        </div>

        <div className="stat-card">
          <h3>Interviews</h3>

          <p>{dashboard.statusCounts.INTERVIEW}</p>
        </div>

        <div className="stat-card">
          <h3>Offers</h3>

          <p>{dashboard.statusCounts.OFFERED}</p>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>

          <p>{dashboard.statusCounts.REJECTED}</p>
        </div>

        <div className="stat-card">
          <h3>Response Rate</h3>

          <p>{dashboard.responseRate}%</p>
        </div>
      </div>

      {/* =================================================
          STATUS CHART
      ================================================== */}

      <section className="chart-card">
        <div className="chart-header">
          <div>
            <h2>Application Status</h2>

            <p>Overview of your applications by current status.</p>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={statusChartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="status" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="applications"
                name="Applications"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* =================================================
          RECENT APPLICATIONS
      ================================================== */}

      <h2>Recent Applications</h2>

      <div className="applications">
        {dashboard.recentApplications.length === 0 ? (
          <div className="empty-card">
            <p>No applications yet.</p>
          </div>
        ) : (
          dashboard.recentApplications.map((application) => (
            <div className="application-card" key={application.id}>
              <h3>{application.jobTitle}</h3>

              <p>{application.Company?.name}</p>

              <span>{application.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
