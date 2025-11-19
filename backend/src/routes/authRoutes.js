const express = require('express');
const auth = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/update-profile', auth, updateProfile);

module.exports = router;
