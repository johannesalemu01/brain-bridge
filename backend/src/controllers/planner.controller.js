const StudyPlan = require('../models/StudyPlan');
const { generateStudyPlan, adjustStudyPlan } = require('../services/openai.service');
const { success, error } = require('../utils/response');

// POST /api/planner/generate
const generate = async (req, res) => {
  try {
    const { subjects, examDate, title, availableHoursPerDay } = req.body;
    if (!subjects?.length || !examDate) {
      return error(res, 'Subjects and exam date are required.', 400);
    }

    const hoursPerDay = availableHoursPerDay || req.user.studyHoursPerDay || 2;
    const language = req.user.language || 'en';

    const aiResult = await generateStudyPlan({ subjects, examDate, hoursPerDay, language });

    const plan = await StudyPlan.create({
      user: req.user._id,
      title: title || aiResult.title,
      subjects,
      examDate,
      availableHoursPerDay: hoursPerDay,
      aiSummary: aiResult.summary,
      tasks: aiResult.tasks,
    });

    return success(res, { plan }, 'Study plan generated', 201);
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to generate study plan.', 500);
  }
};

// GET /api/planner
const getPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ user: req.user._id }).sort('-createdAt');
    return success(res, { plans });
  } catch (err) {
    return error(res, 'Failed to fetch plans.', 500);
  }
};

// GET /api/planner/:id
const getPlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return error(res, 'Plan not found.', 404);
    return success(res, { plan });
  } catch (err) {
    return error(res, 'Failed to fetch plan.', 500);
  }
};

// PATCH /api/planner/:id/task/:taskId
const updateTask = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return error(res, 'Plan not found.', 404);

    const task = plan.tasks.id(req.params.taskId);
    if (!task) return error(res, 'Task not found.', 404);

    if (status) task.status = status;
    if (notes !== undefined) task.notes = notes;

    await plan.save();
    return success(res, { plan }, 'Task updated');
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to update task.', 500);
  }
};

// DELETE /api/planner/:id
const deletePlan = async (req, res) => {
  try {
    await StudyPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    return success(res, null, 'Plan deleted');
  } catch (err) {
    return error(res, 'Failed to delete plan.', 500);
  }
};

// POST /api/planner/:id/adjust
const adjust = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return error(res, 'Plan not found.', 404);

    const remainingTasks = plan.tasks.filter((t) => t.status !== 'completed');
    if (remainingTasks.length === 0) {
      return error(res, 'No remaining tasks to adjust.', 400);
    }

    const aiResult = await adjustStudyPlan({
      title: plan.title,
      examDate: plan.examDate,
      remainingTasks,
      hoursPerDay: plan.availableHoursPerDay || 2,
      language: req.user.language || 'en',
    });

    plan.aiSummary = aiResult.summary;
    // Replace remaining tasks with new ones, keep completed ones
    const completedTasks = plan.tasks.filter((t) => t.status === 'completed');
    plan.tasks = [...completedTasks, ...aiResult.tasks];

    await plan.save();
    return success(res, { plan }, 'Plan adjusted successfully');
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to adjust study plan.', 500);
  }
};

module.exports = { generate, getPlans, getPlan, updateTask, deletePlan, adjust };
