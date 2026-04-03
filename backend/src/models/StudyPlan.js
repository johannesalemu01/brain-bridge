const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  status: {
    type: String,
    enum: ['pending', 'completed', 'skipped'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  notes: { type: String, default: '' },
});

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    subjects: [
      {
        name: String,
        weakLevel: { type: Number, min: 1, max: 5, default: 3 },
        targetScore: { type: Number, min: 0, max: 100 },
      },
    ],
    examDate: { type: Date, required: true },
    availableHoursPerDay: { type: Number, default: 2 },
    tasks: [taskSchema],
    aiSummary: { type: String, default: '' },
    progressPercent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Recalculate progress before saving
studyPlanSchema.pre('save', function () {
  if (this.tasks.length > 0) {
    const done = this.tasks.filter((t) => t.status === 'completed').length;
    this.progressPercent = Math.round((done / this.tasks.length) * 100);
  }
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
