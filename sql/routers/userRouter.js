const express = require('express');
const router = express.Router();
const {getUser,addUser , updateUser, deleteUser} = require("../controllers/userControllers");

router.get("/" , getUser);
router.post("/" , addUser);

router.put("/:id", updateUser); 

router.delete("/:id", deleteUser);

module.exports = router;