const axios = require("axios");

const OPENROUTER_URL =
  process.env.OPENROUTER_BASE_URL ||
  "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/auto";
const hasApiKey =
  !!process.env.OPENROUTER_API_KEY &&
  !process.env.OPENROUTER_API_KEY.includes("XXXXXXXX");

const callOpenRouter = async ({
  prompt,
  temperature = 0.7,
  maxTokens = 800,
  jsonMode = false,
}) => {
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.OPENROUTER_SITE_URL || "http://localhost:5000",
        "X-Title": process.env.OPENROUTER_APP_NAME || "BrainBridge Backend",
      },
      timeout: 30000,
    },
  );

  return response?.data?.choices?.[0]?.message?.content?.trim() || "";
};

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

// ──────────────────────────────────────────────
// Generate a study plan from user inputs
// ──────────────────────────────────────────────
const generateStudyPlan = async ({
  subjects,
  examDate,
  hoursPerDay,
  language,
}) => {
  const daysLeft = Math.ceil(
    (new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24),
  );
  const lang = language === "am" ? "Amharic" : "English";

  const prompt = `
You are an expert academic study planner. A student needs a detailed study schedule.

Subjects (with weak level 1-5):
${subjects.map((s) => `- ${s.name}: weakness level ${s.weakLevel}/5`).join("\n")}

Days until exam: ${daysLeft}
Study hours per day: ${hoursPerDay}
Response language: ${lang}

Create a day-by-day study plan. Return ONLY valid JSON in this exact format:
{
  "title": "string",
  "summary": "string (2-3 sentences motivational overview)",
  "tasks": [
    {
      "subject": "string",
      "topic": "string",
      "date": "YYYY-MM-DD",
      "duration": number (minutes),
      "priority": "low|medium|high",
      "notes": "string"
    }
  ]
}
Generate up to ${Math.min(daysLeft * 3, 30)} tasks spread across the days.
`;

  if (hasApiKey) {
    try {
      const text = await callOpenRouter({
        prompt,
        temperature: 0.7,
        maxTokens: 1400,
        jsonMode: true,
      });

      const parsed = safeJsonParse(text);
      if (parsed?.tasks && Array.isArray(parsed.tasks)) {
        return parsed;
      }
      console.warn("OpenRouter returned invalid JSON structure, falling back to mock.", text);
    } catch (err) {
      console.error("OpenRouter generation error:", err.message);
      // Fall through to mock logic
    }
  }

  const today = new Date();
  const mockTasks = subjects.flatMap((s, i) =>
    Array.from({ length: Math.min(daysLeft, 5) }, (_, d) => {
      const date = new Date(today);
      date.setDate(date.getDate() + d + i);
      return {
        subject: s.name,
        topic: `Core revision – ${s.name} (Day ${d + 1})`,
        date: date.toISOString().split("T")[0],
        duration: Math.round((hoursPerDay * 60) / subjects.length),
        priority:
          s.weakLevel >= 4 ? "high" : s.weakLevel <= 2 ? "low" : "medium",
        notes: "Focus on practice problems and key concepts.",
      };
    }),
  );

  return {
    title: `${daysLeft}-Day Exam Prep Plan`,
    summary: `Your personalized study plan covers ${subjects.length} subject(s) over ${daysLeft} days with ${hoursPerDay} hours/day. Prioritize high-weakness subjects first.`,
    tasks: mockTasks,
  };
};

// ──────────────────────────────────────────────
// Answer a question (Q&A system)
// ──────────────────────────────────────────────
const answerQuestion = async ({ question, subject, language }) => {
  const lang = language === "am" ? "Amharic" : "English";

  const prompt = `You are a helpful, knowledgeable tutor. Answer the following student question clearly and concisely in ${lang}.
Subject: ${subject}
Question: ${question}

Provide a well-structured answer with key points. Use simple language appropriate for students.`;

  if (hasApiKey) {
    const text = await callOpenRouter({
      prompt,
      temperature: 0.6,
      maxTokens: 600,
    });
    if (text) return text;
  }

  const mocks = {
    Mathematics: `Great question! In mathematics, this concept relates to the fundamental principles of the topic. Here are the key points:\n\n1. **Definition**: The core concept can be understood as a systematic approach to problem-solving.\n2. **Key Formula**: Apply the relevant formula step by step.\n3. **Example**: Work through a simple example to verify your understanding.\n4. **Practice Tip**: Solve at least 5 similar problems daily to strengthen this skill.`,
    Physics: `This is an important physics concept! Here's a clear explanation:\n\n1. **Principle**: This phenomenon follows Newton's laws / thermodynamic principles.\n2. **Real-world application**: You can see this in everyday life when...\n3. **Mathematical representation**: The equation governing this is F = ma or similar.\n4. **Remember**: Always check units and directions in physics problems.`,
    default: `Excellent question! Here's a comprehensive answer:\n\n1. **Overview**: This topic is fundamental to understanding the subject matter.\n2. **Key Concepts**: Break down the question into smaller, manageable parts.\n3. **Explanation**: Each component builds on the previous one logically.\n4. **Summary**: Understanding this will help you tackle related problems with confidence.\n\n*This answer was generated by BrainBridge AI. A teacher may review and enhance it.*`,
  };

  return mocks[subject] || mocks.default;
};

// ──────────────────────────────────────────────
// Voice conversation answer
// ──────────────────────────────────────────────
const voiceAnswer = async ({ transcript, language }) => {
  const lang = language === "am" ? "Amharic" : "English";

  const prompt = `You are a friendly AI tutor responding to a student's spoken question. Give a concise, conversational answer in ${lang} (2-4 sentences max, suitable for text-to-speech).

Student asked: "${transcript}"`;

  if (hasApiKey) {
    const text = await callOpenRouter({
      prompt,
      temperature: 0.7,
      maxTokens: 220,
    });
    if (text) return text;
  }

  return language === "am"
    ? "ጥሩ ጥያቄ! ይህ ርዕስ ለእርስዎ ትምህርት አስፈላጊ ነው። ዋና ዋና ጽንሰ-ሐሳቦችን ለመረዳት ሞክሩ እና ተጨማሪ ማብራሪያ ከፈለጉ ሁልጊዜ ይጠይቁ።"
    : "Great question! This is a key concept in your studies. The main idea is to break it down step by step and apply the core principles. I recommend reviewing your notes and practicing with similar examples to strengthen your understanding.";
};

// ──────────────────────────────────────────────
// Adjust (re-plan) remaining study tasks
// ──────────────────────────────────────────────
const adjustStudyPlan = async ({ subjects, examDate, hoursPerDay, language, completedTasks, skippedTasks, pendingTasks }) => {
  const daysLeft = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));
  const lang = language === 'am' ? 'Amharic' : 'English';

  const prompt = `You are an expert academic study planner. A student's study plan needs adjustment because they fell behind.

Current Status:
- Completed tasks: ${completedTasks.length}
- Skipped tasks: ${skippedTasks.length}
- Pending tasks: ${pendingTasks.length}
- Days until exam: ${daysLeft}
- Study hours per day: ${hoursPerDay}

Subjects (with weak level 1-5):
${subjects.map((s) => `- ${s.name}: weakness level ${s.weakLevel}/5`).join('\n')}

Skipped topics that need rescheduling:
${skippedTasks.map((t) => `- ${t.subject}: ${t.topic}`).join('\n') || 'None'}

Pending topics still to cover:
${pendingTasks.map((t) => `- ${t.subject}: ${t.topic}`).join('\n') || 'None'}

Response language: ${lang}

Create an ADJUSTED study plan that:
1. Prioritizes skipped high-priority topics
2. Redistributes remaining work across ${daysLeft} days
3. Gives more time to weak subjects
4. Is realistic for ${hoursPerDay} hours/day

Return ONLY valid JSON:
{
  "summary": "string (2-3 sentences about the adjustment)",
  "tasks": [
    {
      "subject": "string",
      "topic": "string",
      "date": "YYYY-MM-DD",
      "duration": number (minutes),
      "priority": "low|medium|high",
      "notes": "string"
    }
  ]
}
Generate up to ${Math.min(daysLeft * 3, 30)} tasks.`;

  if (hasApiKey) {
    try {
      const res = await callOpenRouter({
        prompt,
        temperature: 0.7,
        maxTokens: 1400,
        jsonMode: true,
      });
      const parsed = safeJsonParse(res);
      if (parsed?.tasks && Array.isArray(parsed.tasks)) {
        return parsed;
      }
      console.warn("OpenRouter returned invalid JSON structure on adjust, falling back to mock.", res);
    } catch (err) {
      console.error("OpenRouter adjust error:", err.message);
    }
  }

  // ── MOCK (no API key) ──
  const today = new Date();
  const allRemainingTopics = [...skippedTasks, ...pendingTasks];
  const mockTasks = allRemainingTopics.slice(0, Math.min(daysLeft * 3, 20)).map((t, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + Math.floor(i / 3));
    return {
      subject: t.subject,
      topic: `[Adjusted] ${t.topic}`,
      date: date.toISOString().split('T')[0],
      duration: Math.round(hoursPerDay * 60 / Math.max(subjects.length, 1)),
      priority: t.priority || 'high',
      notes: 'Rescheduled from adjusted plan – focus on core concepts.',
    };
  });

  return {
    summary: `Your plan has been adjusted! ${skippedTasks.length} skipped topic(s) have been rescheduled across the remaining ${daysLeft} days. Focus on high-priority weak subjects first.`,
    tasks: mockTasks,
  };
};

// ──────────────────────────────────────────────
// Generate an interactive quiz for a task
// ──────────────────────────────────────────────
const generateTaskQuiz = async ({ subject, topic, language }) => {
  const lang = language === 'am' ? 'Amharic' : 'English';
  
  const prompt = `You are an academic tutor preparing a quick, highly specific multiple-choice question to test a student's mastery of a study topic.

Subject: ${subject}
Topic: ${topic}
Language: ${lang}

Return ONLY valid JSON in this exact format:
{
  "question": "The question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": number (0-3 representing the correct option),
  "explanation": "A very brief 1-sentence explanation of why it is correct."
}
Make it challenging but fair.`;

  if (hasApiKey) {
    try {
      const res = await callOpenRouter({
        prompt,
        temperature: 0.7,
        maxTokens: 500,
        jsonMode: true,
      });
      const parsed = safeJsonParse(res);
      if (parsed?.question && Array.isArray(parsed.options)) {
        return parsed;
      }
      console.warn("OpenRouter returned invalid Quiz JSON, falling back to mock.");
    } catch (err) {
      console.error("OpenRouter quiz error:", err.message);
    }
  }

  // ── MOCK (no API key) ──
  return {
    question: `What is the most critical fundamental principle regarding '${topic}' in ${subject}?`,
    options: [
      "It relies entirely on memorization of dates and formulas.",
      "It requires understanding the underlying systemic rules.",
      "It is mostly theoretical and rarely applied practically.",
      "It was disproven in the late 20th century."
    ],
    correctIndex: 1,
    explanation: "Understanding the underlying rules is always the core principle."
  };
};

module.exports = { generateStudyPlan, answerQuestion, voiceAnswer, adjustStudyPlan, generateTaskQuiz };
