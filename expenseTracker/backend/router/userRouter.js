const express = require('express');

const router = express.Router();

const{createUser,getAllUsers , loginUser} = require('../controller/userController');
const { ValidateUser } = require('../utils/middleware');


router.post('/', ValidateUser, createUser);
router.get('/', getAllUsers);
router.post('/login', loginUser);

module.exports = router;
