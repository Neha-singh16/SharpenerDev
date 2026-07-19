const express = require('express');

const router = express.Router();

const{createUser,getAllUsers , loginUser , getProfilet, getProfile} = require('../controller/userController');
const { ValidateUser } = require('../utils/middleware');
const auth = require('../utils/auth');


router.post('/', ValidateUser, createUser);
router.get('/', getAllUsers);
router.post('/login', loginUser);
router.get('/profile', auth , getProfile);


module.exports = router;
