const express = require('express');
const router = express.Router();
const { ask, getAll, getMy, verify, upvote, getPending } = require('../controllers/qa.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.use(protect);

router.post('/ask', ask);
router.get('/', getAll);
router.get('/my', getMy);
router.get('/pending', requireRole('teacher', 'admin'), getPending);
router.patch('/:id/verify', requireRole('teacher', 'admin'), verify);
router.patch('/:id/upvote', upvote);

module.exports = router;
