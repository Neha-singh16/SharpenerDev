const express = require('express');

const router = express.Router();

const{createUser,getAllUsers , loginUser ,getProfile} = require('../controller/userController');
const { ValidateUser } = require('../utils/middleware');
const auth = require('../utils/auth');


router.post('/', ValidateUser, createUser);
router.get('/', getAllUsers);
router.post('/login', loginUser);
router.get('/profile', auth , getProfile);
// router.post("/password-reset", )


module.exports = router;
