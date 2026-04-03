const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: 2000,
    },
    subject: { type: String, default: 'General' },
    language: { type: String, enum: ['en', 'am'], default: 'en' },

    aiAnswer: { type: String, default: '' },
    aiAnsweredAt: { type: Date },

    teacherAnswer: { type: String, default: '' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    teacherVerifiedAt: { type: Date },

    isVerified: { type: Boolean, default: false },

    tags: { type: [String], default: [] },
    upvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },

    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

qaSchema.index({ question: 'text', subject: 'text', tags: 'text' });

module.exports = mongoose.model('QA', qaSchema);
