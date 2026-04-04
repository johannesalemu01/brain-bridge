const express = require('express');
const router = express.Router();
const { generate, getPlans, getPlan, updateTask, deletePlan, adjust, generateQuiz } = require('../controllers/planner.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/generate', generate);
router.post('/:id/adjust', adjust);
router.get('/', getPlans);
router.get('/:id', getPlan);
router.patch('/:id/task/:taskId', updateTask);
router.post('/:id/task/:taskId/quiz', generateQuiz);
router.post('/:id/adjust', adjust);
router.delete('/:id', deletePlan);

module.exports = router;
