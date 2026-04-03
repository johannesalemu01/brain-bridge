const StudyPlan = require('../models/StudyPlan');
const { generateStudyPlan, adjustStudyPlan } = require('../services/openai.service');
const { success, error } = require('../utils/response');

// POST /api/planner/generate
const generate = async (req, res) => {
  try {
    const { subjects, examDate, title } = req.body;
    if (!subjects?.length || !examDate) {
      return error(res, 'Subjects and exam date are required.', 400);
    }

    const hoursPerDay = req.user.studyHoursPerDay || 2;
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
// Re-plans remaining tasks when a student falls behind
const adjust = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return error(res, 'Plan not found.', 404);

    const completedTasks = plan.tasks.filter((t) => t.status === 'completed');
    const skippedTasks = plan.tasks.filter((t) => t.status === 'skipped');
    const pendingTasks = plan.tasks.filter(
      (t) => t.status === 'pending' && new Date(t.date) >= new Date()
    );

    // Also include overdue pending tasks (past date + still pending) as skipped
    const overdueTasks = plan.tasks.filter(
      (t) => t.status === 'pending' && new Date(t.date) < new Date()
    );
    const allSkipped = [...skippedTasks, ...overdueTasks];

    if (allSkipped.length === 0 && pendingTasks.length === 0) {
      return error(res, 'No tasks to adjust. Plan is complete or all tasks are done.', 400);
    }

    const hoursPerDay = plan.availableHoursPerDay || req.user.studyHoursPerDay || 2;
    const language = req.user.language || 'en';

    const aiResult = await adjustStudyPlan({
      subjects: plan.subjects,
      examDate: plan.examDate,
      hoursPerDay,
      language,
      completedTasks: completedTasks.map((t) => ({ subject: t.subject, topic: t.topic })),
      skippedTasks: allSkipped.map((t) => ({ subject: t.subject, topic: t.topic, priority: t.priority })),
      pendingTasks: pendingTasks.map((t) => ({ subject: t.subject, topic: t.topic, priority: t.priority })),
    });

    // Keep completed tasks, replace everything else with AI re-planned tasks
    plan.tasks = [
      ...completedTasks,
      ...aiResult.tasks.map((t) => ({
        ...t,
        status: 'pending',
      })),
    ];
    plan.aiSummary = `[Adjusted] ${aiResult.summary}`;
    await plan.save();

    return success(res, { plan }, 'Study plan adjusted successfully');
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to adjust study plan.', 500);
  }
};

module.exports = { generate, getPlans, getPlan, updateTask, deletePlan, adjust };
