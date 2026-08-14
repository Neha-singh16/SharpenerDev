const express = require("express");

const authenticate =
    require("../middleware/authMiddleware");

const {
    createNote,
    getNotes,
    updateNote,
    deleteNote
} = require("../controllers/noteController");


const router = express.Router();


router.post(
    "/applications/:applicationId/notes",
    authenticate,
    createNote
);


router.get(
    "/applications/:applicationId/notes",
    authenticate,
    getNotes
);


router.put(
    "/notes/:id",
    authenticate,
    updateNote
);


router.delete(
    "/notes/:id",
    authenticate,
    deleteNote
);


module.exports = router;