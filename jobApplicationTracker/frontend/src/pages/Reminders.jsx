import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadReminders() {
    try {
      setLoading(true);

      /*
       * We need reminders across all applications.
       *
       * If your backend currently only supports:
       * GET /applications/:applicationId/reminders
       * then this page can be replaced by the
       * application-details reminder section below.
       *
       * For now, try the dashboard/reminders endpoint
       * only if you have implemented one.
       */

      const response = await api.get("/reminders");

      setReminders(response.data.data || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReminders();
  }, []);

  async function completeReminder(id) {
    try {
      await api.put(`/reminders/${id}`, {
        isCompleted: true,
      });

      setReminders((previous) =>
        previous.map((reminder) =>
          reminder.id === id
            ? {
                ...reminder,
                isCompleted: true,
              }
            : reminder,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete reminder");
    }
  }

  async function deleteReminder(id) {
    if (!window.confirm("Delete this reminder?")) {
      return;
    }

    try {
      await api.delete(`/reminders/${id}`);

      setReminders((previous) =>
        previous.filter((reminder) => reminder.id !== id),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete reminder");
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading reminders...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Reminders</h1>

          <p className="page-subtitle">
            Keep track of recruiter follow-ups and important application dates.
          </p>
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="empty-card">
          <h2>No reminders yet</h2>

          <p>Open an application and create a follow-up reminder.</p>
        </div>
      ) : (
        <div className="reminders-list">
          {reminders.map((reminder) => (
            // <div
            //   className={
            //     reminder.isCompleted
            //       ? "reminder-card completed"
            //       : "reminder-card"
            //   }
            //   key={reminder.id}
            // >
            //   <div>
            //     <h3>{reminder.title}</h3>

            //     {reminder.message && <p>{reminder.message}</p>}

            //     <small>{new Date(reminder.reminderAt).toLocaleString()}</small>
            //   </div>

            //   <div className="reminder-actions">
            //     {!reminder.isCompleted && (
            //       <button onClick={() => completeReminder(reminder.id)}>
            //         Complete
            //       </button>
            //     )}

            //     <button
            //       className="danger-btn"
            //       onClick={() => deleteReminder(reminder.id)}
            //     >
            //       Delete
            //     </button>
            //   </div>
            // </div>
            <div
              className={
                reminder.isCompleted
                  ? "reminder-card completed"
                  : "reminder-card"
              }
              key={reminder.id}
            >
              <div>
                <h3>
                  {reminder.isCompleted && "✓ "}
                  {reminder.title}
                </h3>

                {reminder.message && <p>{reminder.message}</p>}

                <small>{new Date(reminder.reminderAt).toLocaleString()}</small>

                {reminder.isCompleted && (
                  <span className="reminder-completed-label">Completed</span>
                )}
              </div>

              <div className="reminder-actions">
                {!reminder.isCompleted && (
                  <button onClick={() => completeReminder(reminder.id)}>
                    Complete
                  </button>
                )}

                <button
                  className="danger-btn"
                  onClick={() => deleteReminder(reminder.id)}
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

export default Reminders;
