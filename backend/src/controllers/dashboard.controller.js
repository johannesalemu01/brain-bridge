const StudyPlan = require("../models/StudyPlan");
const QA = require("../models/QA");
const VoiceSession = require("../models/VoiceSession");
const { success, error } = require("../utils/response");

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

const calcStreak = (dateKeys) => {
  const daySet = new Set(dateKeys);
  let streak = 0;
  const cursor = new Date();

  while (daySet.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

// GET /api/dashboard/summary
const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const [plans, myQas, voiceSessions] = await Promise.all([
      StudyPlan.find({ user: userId }).sort("-createdAt"),
      QA.find({ student: userId }).sort("-createdAt").limit(20),
      VoiceSession.find({ user: userId }).sort("-createdAt").limit(20),
    ]);

    const allTasks = plans.flatMap((p) => p.tasks || []);
    const completedTasks = allTasks.filter((t) => t.status === "completed");

    const completedTaskMinutes = completedTasks.reduce(
      (sum, task) => sum + (task.duration || 0),
      0,
    );
    const voiceMinutes = voiceSessions.reduce(
      (sum, s) => sum + (s.durationSeconds ? s.durationSeconds / 60 : 0),
      0,
    );

    const activityDays = [
      ...completedTasks.map((t) => t.date),
      ...myQas.map((q) => q.createdAt),
      ...voiceSessions.map((s) => s.createdAt),
      ...plans.map((p) => p.createdAt),
    ];

    const stats = {
      studyStreakDays: calcStreak(activityDays.map(dayKey)),
      hoursLearned: Number(
        ((completedTaskMinutes + voiceMinutes) / 60).toFixed(1),
      ),
      tasksCompleted: completedTasks.length,
      tasksTotal: allTasks.length,
      questionsAsked: myQas.length,
      voiceSessions: voiceSessions.length,
    };

    const activities = [
      ...plans.slice(0, 5).map((plan) => ({
        type: "plan_created",
        title: `Created study plan: ${plan.title}`,
        createdAt: plan.createdAt,
      })),
      ...myQas.slice(0, 5).map((qa) => ({
        type: "qa_asked",
        title: `Asked: ${qa.question.slice(0, 90)}${qa.question.length > 90 ? "…" : ""}`,
        createdAt: qa.createdAt,
      })),
      ...voiceSessions.slice(0, 5).map((session) => ({
        type: "voice_session",
        title: `Voice session: ${session.transcript.slice(0, 90)}${session.transcript.length > 90 ? "…" : ""}`,
        createdAt: session.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    let teacher = null;
    if (req.user.role === "teacher" || req.user.role === "admin") {
      const [pendingVerification, totalVerified, latestVerified] =
        await Promise.all([
          QA.countDocuments({ isVerified: false }),
          QA.countDocuments({ isVerified: true }),
          QA.findOne({ isVerified: true, teacher: userId })
            .sort("-teacherVerifiedAt")
            .select("teacherVerifiedAt"),
        ]);

      teacher = {
        pendingVerification,
        totalVerified,
        recentVerifiedAt: latestVerified?.teacherVerifiedAt || null,
      };
    }

    return success(
      res,
      { stats, activities, teacher },
      "Dashboard summary fetched",
    );
  } catch (err) {
    console.error(err);
    return error(res, "Failed to fetch dashboard summary.", 500);
  }
};

module.exports = { getSummary };
