const express = require('express');
const auth = require('../middleware/auth');
const {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  addMember,
  removeMember,
  deleteGroup,
} = require('../controllers/groupController');

const router = express.Router();

router.post('/', auth, createGroup);
router.get('/', auth, getGroups);
router.get('/:id', auth, getGroup);
router.put('/:id', auth, updateGroup);
router.post('/:id/members', auth, addMember);
router.delete('/:id/members/:memberId', auth, removeMember);
router.delete('/:id', auth, deleteGroup);

module.exports = router;
