const express = require('express');
const router = express.Router();
const { generate, getPlans, getPlan, updateTask, deletePlan, adjust } = require('../controllers/planner.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/generate', generate);
router.get('/', getPlans);
router.get('/:id', getPlan);
router.patch('/:id/task/:taskId', updateTask);
router.post('/:id/adjust', adjust);
router.delete('/:id', deletePlan);

module.exports = router;
