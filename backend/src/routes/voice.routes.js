const express = require('express');
const router = express.Router();
const { ask, getHistory, saveToQA } = require('../controllers/voice.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/ask', ask);
router.get('/history', getHistory);
router.post('/:id/save-to-qa', saveToQA);

module.exports = router;
