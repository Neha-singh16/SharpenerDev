import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function ApplicationDetails() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const [notesLoading, setNotesLoading] = useState(true);
  const [application, setApplication] = useState(null);

  const [reminderTitle, setReminderTitle] = useState("");

  const [reminderMessage, setReminderMessage] = useState("");

  const [reminderAt, setReminderAt] = useState("");

  const [reminders, setReminders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadApplication();
    loadNotes();
    loadReminders();
  }, [id]);

  async function loadNotes() {
    try {
      setNotesLoading(true);

      const response = await api.get(`/applications/${id}/notes`);

      setNotes(response.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setNotesLoading(false);
    }
  }

  async function addNote(e) {
    e.preventDefault();

    if (!newNote.trim()) {
      return;
    }

    try {
      await api.post(`/applications/${id}/notes`, {
        content: newNote,
      });

      setNewNote("");

      await loadNotes();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add note");
    }
  }

  async function loadApplication() {
    try {
      const response = await api.get(`/applications/${id}`);

      setApplication(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Application not found");
    } finally {
      setLoading(false);
    }
  }

  async function createReminder(e) {
    e.preventDefault();

    if (!reminderTitle.trim()) {
      alert("Reminder title is required");

      return;
    }

    if (!reminderAt) {
      alert("Please select a date and time");

      return;
    }

    try {
      const response = await api.post(`/applications/${id}/reminders`, {
        title: reminderTitle,
        message: reminderMessage,
        reminderAt,
      });

      setReminders((previous) => [...previous, response.data.data]);

      setReminderTitle("");
      setReminderMessage("");
      setReminderAt("");

      alert("Reminder created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create reminder");
    }
  }

  async function loadReminders() {
    try {
      const response = await api.get(`/applications/${id}/reminders`);

      setReminders(response.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  }
  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading application...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <p className="error">{error}</p>

        <Link to="/applications">← Back to Applications</Link>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Link to="/applications">← Back to Applications</Link>

      <div className="details-header">
        <div>
          <p className="details-company">{application.Company?.name}</p>

          <h1>{application.jobTitle}</h1>

          <span className={`status-badge ${application.status.toLowerCase()}`}>
            {application.status}
          </span>
        </div>

        {application.jobUrl && (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="job-link"
          >
            View Job Posting ↗
          </a>
        )}
      </div>

      <div className="details-grid">
        <section className="detail-section">
          <h2>Application Details</h2>

          <div className="detail-row">
            <span>Company</span>
            <strong>{application.Company?.name}</strong>
          </div>

          <div className="detail-row">
            <span>Job Title</span>
            <strong>{application.jobTitle}</strong>
          </div>

          <div className="detail-row">
            <span>Status</span>
            <strong>{application.status}</strong>
          </div>

          <div className="detail-row">
            <span>Applied</span>
            <strong>
              {new Date(application.appliedAt).toLocaleDateString()}
            </strong>
          </div>

          <div className="detail-row">
            <span>Source</span>
            <strong>{application.source || "—"}</strong>
          </div>
        </section>
        <section className="detail-section">
          <div className="section-header">
            <h2>Follow-up Reminders</h2>

            <span>{reminders.length}</span>
          </div>

          <form className="reminder-form" onSubmit={createReminder}>
            <input
              type="text"
              placeholder="Reminder title"
              value={reminderTitle}
              onChange={(e) => setReminderTitle(e.target.value)}
            />

            <textarea
              placeholder="What do you need to remember?"
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
            />

            <label>Reminder date & time</label>

            <input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
            />

            <button type="submit">+ Set Reminder</button>
          </form>

          <div className="reminders-list">
            {reminders.length === 0 ? (
              <p className="empty-state">No reminders for this application.</p>
            ) : (
              reminders.map((reminder) => (
                <div
                  className={
                    reminder.isCompleted
                      ? "reminder-card completed"
                      : "reminder-card"
                  }
                  key={reminder.id}
                >
                  <div>
                    <h3>{reminder.title}</h3>

                    {reminder.message && <p>{reminder.message}</p>}

                    <small>
                      {new Date(reminder.reminderAt).toLocaleString()}
                    </small>
                  </div>

                  {!reminder.isCompleted && (
                    <button
                      onClick={async () => {
                        try {
                          await api.put(`/reminders/${reminder.id}`, {
                            isCompleted: true,
                          });

                          loadReminders();
                        } catch (error) {
                          alert(
                            error.response?.data?.message ||
                              "Failed to complete reminder",
                          );
                        }
                      }}
                    >
                      Complete
                    </button>
                  )}
                </div>
              ))
            )}

            <h2>Notes</h2>

            <span>{notes.length}</span>
          </div>

          <form className="note-form" onSubmit={addNote}>
            <textarea
              placeholder="Add an interaction, recruiter update, interview note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />

            <button type="submit">Add Note</button>
          </form>

          <div className="notes-list">
            {notesLoading ? (
              <p className="empty-state">Loading notes...</p>
            ) : notes.length === 0 ? (
              <p className="empty-state">No notes yet.</p>
            ) : (
              notes.map((note) => (
                <div className="note-item" key={note.id}>
                  <p>{note.content}</p>

                  <small>{new Date(note.createdAt).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        </section>
        <section className="detail-section">
          <h2>Attachments</h2>

          <p className="empty-state">Attachments will appear here.</p>
        </section>

        <section className="detail-section">
          <h2>Reminders</h2>

          <p className="empty-state">Reminders will appear here.</p>
        </section>
      </div>
    </div>
  );
}

export default ApplicationDetails;
