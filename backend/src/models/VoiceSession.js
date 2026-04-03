const mongoose = require('mongoose');

const voiceSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    language: { type: String, enum: ['en', 'am'], default: 'en' },
    inputType: { type: String, enum: ['voice', 'text'], default: 'voice' },

    transcript: { type: String, default: '' },
    aiResponse: { type: String, default: '' },

    audioInputUrl: { type: String, default: '' },
    audioOutputUrl: { type: String, default: '' },

    subject: { type: String, default: 'General' },
    durationSeconds: { type: Number, default: 0 },

    savedToQA: { type: Boolean, default: false },
    qaRef: { type: mongoose.Schema.Types.ObjectId, ref: 'QA' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VoiceSession', voiceSessionSchema);
