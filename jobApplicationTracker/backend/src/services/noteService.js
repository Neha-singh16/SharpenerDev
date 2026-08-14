const { Note, Application } = require("../models");

async function createNote(userId, applicationId, content) {
  if (!content || !content.trim()) {
    const error = new Error("Note content is required");

    error.statusCode = 422;

    throw error;
  }

  const application = await Application.findOne({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!application) {
    const error = new Error("Application not found");

    error.statusCode = 404;

    throw error;
  }

  const note = await Note.create({
    userId,

    applicationId,

    content: content.trim(),
  });

  return note;
}

async function getNotes(userId, applicationId) {
  const application = await Application.findOne({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!application) {
    const error = new Error("Application not found");

    error.statusCode = 404;

    throw error;
  }

  return Note.findAll({
    where: {
      userId,
      applicationId,
    },

    order: [["createdAt", "DESC"]],
  });
}

async function updateNote(userId, noteId, content) {
  const note = await Note.findOne({
    where: {
      id: noteId,
      userId,
    },
  });

  if (!note) {
    const error = new Error("Note not found");

    error.statusCode = 404;

    throw error;
  }

  if (!content || !content.trim()) {
    const error = new Error("Note content is required");

    error.statusCode = 422;

    throw error;
  }

  await note.update({
    content: content.trim(),
  });

  return note;
}

async function deleteNote(userId, noteId) {
  const note = await Note.findOne({
    where: {
      id: noteId,
      userId,
    },
  });

  if (!note) {
    const error = new Error("Note not found");

    error.statusCode = 404;

    throw error;
  }

  await note.destroy();
}

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
