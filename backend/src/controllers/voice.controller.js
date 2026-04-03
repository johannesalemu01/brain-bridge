const VoiceSession = require("../models/VoiceSession");
const { voiceAnswer } = require("../services/gemini.service");
const { success, error } = require("../utils/response");

// POST /api/voice/ask
// Accepts transcript (text) from browser STT, returns AI text answer
const ask = async (req, res) => {
  try {
    const { transcript, language, subject, inputType } = req.body;
    if (!transcript) return error(res, "Transcript is required.", 400);

    const lang = language || req.user.language || "en";
    const aiResponse = await voiceAnswer({ transcript, language: lang });

    const session = await VoiceSession.create({
      user: req.user._id,
      language: lang,
      inputType: inputType === "text" ? "text" : "voice",
      transcript,
      aiResponse,
      subject: subject || "General",
    });

    return success(
      res,
      { session, aiResponse },
      "Voice question answered",
      201,
    );
  } catch (err) {
    console.error(err);
    return error(res, "Voice processing failed.", 500);
  }
};

// GET /api/voice/history
const getHistory = async (req, res) => {
  try {
    const sessions = await VoiceSession.find({ user: req.user._id })
      .sort("-createdAt")
      .limit(30);
    return success(res, { sessions });
  } catch (err) {
    return error(res, "Failed to fetch voice history.", 500);
  }
};

// POST /api/voice/:id/save-to-qa
// Save a voice session to the public Q&A knowledge base
const saveToQA = async (req, res) => {
  try {
    const QA = require("../models/QA");
    const session = await VoiceSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!session) return error(res, "Session not found.", 404);

    const qa = await QA.create({
      student: req.user._id,
      question: session.transcript,
      aiAnswer: session.aiResponse,
      language: session.language,
      subject: session.subject,
      aiAnsweredAt: session.createdAt,
    });

    session.savedToQA = true;
    session.qaRef = qa._id;
    await session.save();

    return success(res, { qa }, "Saved to knowledge base");
  } catch (err) {
    console.error(err);
    return error(res, "Failed to save to Q&A.", 500);
  }
};

module.exports = { ask, getHistory, saveToQA };
