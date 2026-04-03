const QA = require('../models/QA');
const { answerQuestion } = require('../services/openai.service');
const { success, error } = require('../utils/response');

// POST /api/qa/ask
const ask = async (req, res) => {
  try {
    const { question, subject, language } = req.body;
    if (!question) return error(res, 'Question is required.', 400);

    const lang = language || req.user.language || 'en';
    const subj = subject || 'General';

    const aiAnswer = await answerQuestion({ question, subject: subj, language: lang });

    const qa = await QA.create({
      student: req.user._id,
      question,
      subject: subj,
      language: lang,
      aiAnswer,
      aiAnsweredAt: new Date(),
    });

    await qa.populate('student', 'name avatar role');
    return success(res, { qa }, 'Question answered', 201);
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to process question.', 500);
  }
};

// GET /api/qa  (knowledge base)
const getAll = async (req, res) => {
  try {
    const { subject, search, verified, page = 1, limit = 20 } = req.query;
    const filter = { isPublic: true };
    if (subject) filter.subject = subject;
    if (verified !== undefined) filter.isVerified = verified === 'true';
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [qas, total] = await Promise.all([
      QA.find(filter)
        .populate('student', 'name avatar')
        .populate('teacher', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      QA.countDocuments(filter),
    ]);

    return success(res, { qas, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    return error(res, 'Failed to fetch Q&As.', 500);
  }
};

// GET /api/qa/my
const getMy = async (req, res) => {
  try {
    const qas = await QA.find({ student: req.user._id })
      .populate('teacher', 'name avatar')
      .sort('-createdAt');
    return success(res, { qas });
  } catch (err) {
    return error(res, 'Failed to fetch your Q&As.', 500);
  }
};

// PATCH /api/qa/:id/verify  (teacher only)
const verify = async (req, res) => {
  try {
    const { teacherAnswer } = req.body;
    const qa = await QA.findById(req.params.id);
    if (!qa) return error(res, 'Q&A not found.', 404);

    qa.teacherAnswer = teacherAnswer || qa.aiAnswer;
    qa.teacher = req.user._id;
    qa.isVerified = true;
    qa.teacherVerifiedAt = new Date();
    await qa.save();

    await qa.populate('student', 'name avatar');
    await qa.populate('teacher', 'name avatar');
    return success(res, { qa }, 'Answer verified by teacher');
  } catch (err) {
    console.error(err);
    return error(res, 'Verification failed.', 500);
  }
};

// PATCH /api/qa/:id/upvote
const upvote = async (req, res) => {
  try {
    const qa = await QA.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!qa) return error(res, 'Q&A not found.', 404);
    return success(res, { upvotes: qa.upvotes });
  } catch (err) {
    return error(res, 'Failed to upvote.', 500);
  }
};

// GET /api/qa/pending  (teacher — unverified)
const getPending = async (req, res) => {
  try {
    const qas = await QA.find({ isVerified: false })
      .populate('student', 'name avatar')
      .sort('-createdAt')
      .limit(50);
    return success(res, { qas });
  } catch (err) {
    return error(res, 'Failed to fetch pending Q&As.', 500);
  }
};

module.exports = { ask, getAll, getMy, verify, upvote, getPending };
