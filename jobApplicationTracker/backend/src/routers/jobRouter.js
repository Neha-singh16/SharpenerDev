const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

const router = express.Router();

router.use(authenticate);

router.post("/", createJob);

router.get("/", getJobs);

router.get("/:id", getJobById);

router.put("/:id", updateJob);

router.delete("/:id", deleteJob);

module.exports = router;