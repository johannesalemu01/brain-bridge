# BrainBridge AI 🧠

> **Connecting Students, AI & Teachers** — An all-in-one intelligent learning platform for smarter studying.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://mongodb.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-blue)](https://openai.com)

---

## 💡 What is BrainBridge?

BrainBridge AI is a hackathon project that combines **AI-powered study planning**, **voice-based learning** (Amharic + English), and a **teacher-verified Q&A system** into one seamless platform.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🧠 AI Study Planner | Personalized schedules based on exam dates, weak subjects & available time |
| 🎙 Voice Learning | Ask in Amharic or English — get instant AI audio/text answers |
| 🧑‍🏫 Q&A Knowledge Base | AI answers + teacher verification = trusted knowledge base |

---

## 🏗 Tech Stack

- **Frontend**: Next.js 14, TypeScript, shadcn/ui, Tailwind CSS
- **Backend**: Node.js, Express.js, REST API
- **Database**: MongoDB + Mongoose
- **AI**: OpenAI GPT-4o (study plans, Q&A, Amharic support)
- **Auth**: JWT (access tokens)

---

## 📁 Project Structure

```
brain-bridge/
├── backend/   # Express REST API
└── frontend/  # Next.js 14 App
```

---

## ⚙️ Getting Started

### Backend
```bash
cd backend
cp .env.example .env   # Fill in your values
npm install
npm run dev            # Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # Runs on http://localhost:3000
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register student/teacher |
| POST | `/api/auth/login` | Login |
| POST | `/api/planner/generate` | AI generates study schedule |
| GET | `/api/planner` | Get user plans |
| POST | `/api/qa/ask` | Ask a question (AI answers) |
| PATCH | `/api/qa/:id/verify` | Teacher verifies answer |
| POST | `/api/voice/ask` | Voice question → AI answer |

---

## 👥 Team

Built with ❤️ for the hackathon by Team BrainBridge.

---

## 📄 License

MIT
