// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "../services/api";

// function ApplicationDetails() {
//   const { id } = useParams();
//   const [notes, setNotes] = useState([]);
//   const [newNote, setNewNote] = useState("");

//   const [notesLoading, setNotesLoading] = useState(true);
//   const [application, setApplication] = useState(null);

//   const [reminderTitle, setReminderTitle] = useState("");

//   const [reminderMessage, setReminderMessage] = useState("");

//   const [reminderAt, setReminderAt] = useState("");

//   const [reminders, setReminders] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadApplication();
//     loadNotes();
//     loadReminders();
//   }, [id]);

//   async function loadNotes() {
//     try {
//       setNotesLoading(true);

//       const response = await api.get(`/applications/${id}/notes`);

//       setNotes(response.data.data);
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//     } finally {
//       setNotesLoading(false);
//     }
//   }

//   async function addNote(e) {
//     e.preventDefault();

//     if (!newNote.trim()) {
//       return;
//     }

//     try {
//       await api.post(`/applications/${id}/notes`, {
//         content: newNote,
//       });

//       setNewNote("");

//       await loadNotes();
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to add note");
//     }
//   }

//   async function loadApplication() {
//     try {
//       const response = await api.get(`/applications/${id}`);

//       setApplication(response.data.data);
//     } catch (error) {
//       setError(error.response?.data?.message || "Application not found");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function createReminder(e) {
//     e.preventDefault();

//     if (!reminderTitle.trim()) {
//       alert("Reminder title is required");

//       return;
//     }

//     if (!reminderAt) {
//       alert("Please select a date and time");

//       return;
//     }

//     try {
//       const response = await api.post(`/applications/${id}/reminders`, {
//         title: reminderTitle,
//         message: reminderMessage,
//         reminderAt,
//       });

//       setReminders((previous) => [...previous, response.data.data]);

//       setReminderTitle("");
//       setReminderMessage("");
//       setReminderAt("");

//       alert("Reminder created successfully");
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to create reminder");
//     }
//   }

//   async function loadReminders() {
//     try {
//       const response = await api.get(`/applications/${id}/reminders`);

//       setReminders(response.data.data);
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//     }
//   }
//   if (loading) {
//     return (
//       <div className="dashboard">
//         <p>Loading application...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="dashboard">
//         <p className="error">{error}</p>

//         <Link to="/applications">← Back to Applications</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard">
//       <Link to="/applications">← Back to Applications</Link>

//       <div className="details-header">
//         <div>
//           <p className="details-company">{application.Company?.name}</p>

//           <h1>{application.jobTitle}</h1>

//           <span className={`status-badge ${application.status.toLowerCase()}`}>
//             {application.status}
//           </span>
//         </div>

//         {application.jobUrl && (
//           <a
//             href={application.jobUrl}
//             target="_blank"
//             rel="noreferrer"
//             className="job-link"
//           >
//             View Job Posting ↗
//           </a>
//         )}
//       </div>

//       <div className="details-grid">
//         <section className="detail-section">
//           <h2>Application Details</h2>

//           <div className="detail-row">
//             <span>Company</span>
//             <strong>{application.Company?.name}</strong>
//           </div>

//           <div className="detail-row">
//             <span>Job Title</span>
//             <strong>{application.jobTitle}</strong>
//           </div>

//           <div className="detail-row">
//             <span>Status</span>
//             <strong>{application.status}</strong>
//           </div>

//           <div className="detail-row">
//             <span>Applied</span>
//             <strong>
//               {new Date(application.appliedAt).toLocaleDateString()}
//             </strong>
//           </div>

//           <div className="detail-row">
//             <span>Source</span>
//             <strong>{application.source || "—"}</strong>
//           </div>
//         </section>
//         <section className="detail-section">
//           <div className="section-header">
//             <h2>Follow-up Reminders</h2>

//             <span>{reminders.length}</span>
//           </div>

//           <form className="reminder-form" onSubmit={createReminder}>
//             <input
//               type="text"
//               placeholder="Reminder title"
//               value={reminderTitle}
//               onChange={(e) => setReminderTitle(e.target.value)}
//             />

//             <textarea
//               placeholder="What do you need to remember?"
//               value={reminderMessage}
//               onChange={(e) => setReminderMessage(e.target.value)}
//             />

//             <label>Reminder date & time</label>

//             <input
//               type="datetime-local"
//               value={reminderAt}
//               onChange={(e) => setReminderAt(e.target.value)}
//             />

//             <button type="submit">+ Set Reminder</button>
//           </form>

//           <div className="reminders-list">
//             {reminders.length === 0 ? (
//               <p className="empty-state">No reminders for this application.</p>
//             ) : (
//               reminders.map((reminder) => (
//                 <div
//                   className={
//                     reminder.isCompleted
//                       ? "reminder-card completed"
//                       : "reminder-card"
//                   }
//                   key={reminder.id}
//                 >
//                   <div>
//                     <h3>{reminder.title}</h3>

//                     {reminder.message && <p>{reminder.message}</p>}

//                     <small>
//                       {new Date(reminder.reminderAt).toLocaleString()}
//                     </small>
//                   </div>

//                   {!reminder.isCompleted && (
//                     <button
//                       onClick={async () => {
//                         try {
//                           await api.put(`/reminders/${reminder.id}`, {
//                             isCompleted: true,
//                           });

//                           loadReminders();
//                         } catch (error) {
//                           alert(
//                             error.response?.data?.message ||
//                               "Failed to complete reminder",
//                           );
//                         }
//                       }}
//                     >
//                       Complete
//                     </button>
//                   )}
//                 </div>
//               ))
//             )}

//             <h2>Notes</h2>

//             <span>{notes.length}</span>
//           </div>

//           <form className="note-form" onSubmit={addNote}>
//             <textarea
//               placeholder="Add an interaction, recruiter update, interview note..."
//               value={newNote}
//               onChange={(e) => setNewNote(e.target.value)}
//             />

//             <button type="submit">Add Note</button>
//           </form>

//           <div className="notes-list">
//             {notesLoading ? (
//               <p className="empty-state">Loading notes...</p>
//             ) : notes.length === 0 ? (
//               <p className="empty-state">No notes yet.</p>
//             ) : (
//               notes.map((note) => (
//                 <div className="note-item" key={note.id}>
//                   <p>{note.content}</p>

//                   <small>{new Date(note.createdAt).toLocaleString()}</small>
//                 </div>
//               ))
//             )}
//           </div>
//         </section>
//         <section className="detail-section">
//           <h2>Attachments</h2>

//           <p className="empty-state">Attachments will appear here.</p>
//         </section>

//         <section className="detail-section">
//           <h2>Reminders</h2>

//           <p className="empty-state">Reminders will appear here.</p>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default ApplicationDetails;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function ApplicationDetails() {
  const { id } = useParams();

  // =========================================================
  // APPLICATION
  // =========================================================

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // NOTES
  // =========================================================

  const [notes, setNotes] = useState([]);

  const [newNote, setNewNote] = useState("");

  const [notesLoading, setNotesLoading] = useState(true);

  // =========================================================
  // REMINDERS
  // =========================================================

  const [reminderTitle, setReminderTitle] = useState("");

  const [reminderMessage, setReminderMessage] = useState("");

  const [reminderAt, setReminderAt] = useState("");

  const [reminders, setReminders] = useState([]);

  // =========================================================
  // ATTACHMENTS
  // =========================================================

  const [attachments, setAttachments] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);

  const [documentType, setDocumentType] = useState("RESUME");

  const [attachmentLoading, setAttachmentLoading] = useState(false);

  // =========================================================
  // LOAD EVERYTHING
  // =========================================================

  useEffect(() => {
    loadApplication();
    loadNotes();
    loadReminders();
    loadAttachments();
  }, [id]);

  // =========================================================
  // APPLICATION
  // =========================================================

  async function loadApplication() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/applications/${id}`);

      setApplication(response.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);

      setError(error.response?.data?.message || "Application not found");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // NOTES
  // =========================================================

  async function loadNotes() {
    try {
      setNotesLoading(true);

      const response = await api.get(`/applications/${id}/notes`);

      setNotes(response.data.data || []);
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
        content: newNote.trim(),
      });

      setNewNote("");

      await loadNotes();
    } catch (error) {
      console.error(error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to add note");
    }
  }

  // =========================================================
  // REMINDERS
  // =========================================================

  async function loadReminders() {
    try {
      const response = await api.get(`/applications/${id}/reminders`);

      setReminders(response.data.data || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
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
        title: reminderTitle.trim(),
        message: reminderMessage.trim(),
        reminderAt,
      });

      setReminders((previous) => [...previous, response.data.data]);

      setReminderTitle("");
      setReminderMessage("");
      setReminderAt("");

      alert("Reminder created successfully");
    } catch (error) {
      console.error(error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to create reminder");
    }
  }

  async function completeReminder(reminderId) {
    try {
      await api.put(`/reminders/${reminderId}`, {
        isCompleted: true,
      });

      /*
       * Update the UI immediately.
       * The backend will store isCompleted = true.
       */

      setReminders((previous) =>
        previous.map((reminder) =>
          reminder.id === reminderId
            ? {
                ...reminder,
                isCompleted: true,
              }
            : reminder,
        ),
      );
    } catch (error) {
      console.error(error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to complete reminder");
    }
  }

  // =========================================================
  // ATTACHMENTS
  // =========================================================

  async function loadAttachments() {
    try {
      const response = await api.get(`/applications/${id}/attachments`);

      setAttachments(response.data.data || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  }

  // ---------------------------------------------------------
  // FILE SELECT
  // ---------------------------------------------------------

  function handleFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    /*
     * Frontend validation.
     *
     * Your backend upload middleware may have
     * additional validation, so this is only
     * an early check for the user.
     */

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PDF, DOC, or DOCX file.");

      e.target.value = "";
      setSelectedFile(null);

      return;
    }

    /*
     * 10 MB frontend limit.
     *
     * If your backend has a different limit,
     * keep the backend limit as the final authority.
     */

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size must be less than 10 MB.");

      e.target.value = "";
      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  }

  // ---------------------------------------------------------
  // UPLOAD
  // ---------------------------------------------------------

  async function uploadAttachment(e) {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    try {
      setAttachmentLoading(true);

      /*
       * IMPORTANT:
       *
       * Backend uses:
       *
       * upload.single("file")
       *
       * Therefore the FormData field MUST be:
       *
       * file
       */

      const formData = new FormData();

      formData.append("file", selectedFile);

      formData.append("documentType", documentType);

      const response = await api.post(
        `/applications/${id}/attachments`,
        formData,
      );

      /*
       * Add newly uploaded attachment
       * immediately to the UI.
       */

      setAttachments((previous) => [response.data.data, ...previous]);

      // Reset state
      setSelectedFile(null);
      setDocumentType("RESUME");

      /*
       * Reset the actual file input.
       */

      e.target.reset();

      alert("Attachment uploaded successfully.");
    } catch (error) {
      console.error(error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to upload attachment");
    } finally {
      setAttachmentLoading(false);
    }
  }

  // ---------------------------------------------------------
  // DOWNLOAD
  // ---------------------------------------------------------

  async function downloadAttachment(attachment) {
    try {
      /*
       * Backend streams the file.
       *
       * Therefore Axios must receive
       * the response as a Blob.
       */

      const response = await api.get(`/attachments/${attachment.id}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: attachment.mimeType,
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = attachment.originalName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error.response?.data || error.message);

      alert("Failed to download attachment.");
    }
  }

  // ---------------------------------------------------------
  // DELETE ATTACHMENT
  // ---------------------------------------------------------

  async function deleteAttachment(attachmentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attachment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/attachments/${attachmentId}`);

      setAttachments((previous) =>
        previous.filter((attachment) => attachment.id !== attachmentId),
      );

      alert("Attachment deleted successfully.");
    } catch (error) {
      console.error(error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to delete attachment");
    }
  }

  // =========================================================
  // FILE SIZE FORMATTER
  // =========================================================

  function formatFileSize(bytes) {
    if (!bytes) {
      return "0 KB";
    }

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;

    return `${mb.toFixed(1)} MB`;
  }

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading application...</p>
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error || !application) {
    return (
      <div className="dashboard">
        <p className="error">{error || "Application not found"}</p>

        <Link to="/applications">← Back to Applications</Link>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="dashboard">
      {/* =====================================================
          BACK LINK
      ====================================================== */}

      <Link to="/applications">← Back to Applications</Link>

      {/* =====================================================
          APPLICATION HEADER
      ====================================================== */}

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

      {/* =====================================================
          DETAILS GRID
      ====================================================== */}

      <div className="details-grid">
        {/* ===================================================
            APPLICATION DETAILS
        ==================================================== */}

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

        {/* ===================================================
            FOLLOW-UP REMINDERS
        ==================================================== */}

        <section className="detail-section">
          <div className="section-header">
            <h2>Follow-up Reminders</h2>

            <span>{reminders.length}</span>
          </div>

          {/* CREATE REMINDER */}

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

          {/* REMINDER LIST */}

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
                      type="button"
                      onClick={() => completeReminder(reminder.id)}
                    >
                      Complete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* ===================================================
            NOTES
        ==================================================== */}

        <section className="detail-section">
          <div className="section-header">
            <h2>Notes</h2>

            <span>{notes.length}</span>
          </div>

          {/* ADD NOTE */}

          <form className="note-form" onSubmit={addNote}>
            <textarea
              placeholder="Add an interaction, recruiter update, interview note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />

            <button type="submit">Add Note</button>
          </form>

          {/* NOTES LIST */}

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

        {/* ===================================================
            ATTACHMENTS
        ==================================================== */}

        <section className="detail-section attachments-section">
          <div className="section-header">
            <div>
              <h2>Attachments</h2>

              <p className="page-subtitle">
                Upload resumes, cover letters and other documents for this
                application.
              </p>
            </div>

            <span>{attachments.length}</span>
          </div>

          {/* =================================================
              UPLOAD FORM
          ================================================== */}

          <form className="attachment-form" onSubmit={uploadAttachment}>
            {/* DOCUMENT TYPE */}

            <div className="attachment-field">
              <label htmlFor="documentType">Document Type</label>

              <select
                id="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                disabled={attachmentLoading}
              >
                <option value="RESUME">Resume</option>

                <option value="COVER_LETTER">Cover Letter</option>

                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* FILE */}

            <div className="attachment-field">
              <label htmlFor="attachmentFile">Select File</label>

              <input
                id="attachmentFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={attachmentLoading}
              />
            </div>

            {/* SELECTED FILE */}

            {selectedFile && (
              <p className="selected-file">
                Selected: <strong>{selectedFile.name}</strong>
              </p>
            )}

            {/* UPLOAD BUTTON */}

            <button type="submit" disabled={attachmentLoading || !selectedFile}>
              {attachmentLoading ? "Uploading..." : "Upload Attachment"}
            </button>
          </form>

          {/* =================================================
              ATTACHMENT LIST
          ================================================== */}

          <div className="attachments-list">
            {attachments.length === 0 ? (
              <p className="empty-state">No attachments uploaded yet.</p>
            ) : (
              attachments.map((attachment) => (
                <div className="attachment-card" key={attachment.id}>
                  {/* FILE INFORMATION */}

                  <div className="attachment-info">
                    <div className="attachment-icon">📄</div>

                    <div>
                      <h3>{attachment.originalName}</h3>

                      <p>{attachment.documentType.replace("_", " ")}</p>

                      <small>
                        {formatFileSize(attachment.fileSize)}

                        {" • "}

                        {new Date(attachment.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="attachment-actions">
                    <button
                      type="button"
                      onClick={() => downloadAttachment(attachment)}
                    >
                      Download
                    </button>

                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => deleteAttachment(attachment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ApplicationDetails;
