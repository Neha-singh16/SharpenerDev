const express = require('express');

const router = express.Router();

const{createUser,getAllUsers} = require('../controller/userController');
const { ValidateUser } = require('../utils/middleware');


router.post('/', ValidateUser, createUser);
router.get('/', getAllUsers);

module.exports = router;
