const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const  {applicationQueryValidator }= require("../validators/validators");
const validate = require("../middleware/validatorMiddleware");
const {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
} = require("../controllers/applicationController");


const router = express.Router();


router.use(authenticate);


router.post("/", createApplication);

// router.get("/", getApplications);
router.get(
    "/",
    applicationQueryValidator,
    validate,
    getApplications
);

router.get("/:id", getApplicationById);

router.put("/:id", updateApplication);

router.delete("/:id", deleteApplication);


module.exports = router;