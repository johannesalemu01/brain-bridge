const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name too long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin', 'school_admin'],
      default: 'student',
    },
    language: {
      type: String,
      enum: ['en', 'am'],
      default: 'en',
    },
    avatar: {
      type: String,
      default: '',
    },
    grade: {
      type: String,
      default: '',
    },
    subjects: {
      type: [String],
      default: [],
    },
    studyHoursPerDay: {
      type: Number,
      default: 2,
      min: 0.5,
      max: 12,
    },
    // Gamification & Community
    xp: {
      type: Number,
      default: 0,
    },
    reputationPoints: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    level: {
      type: Number,
      default: 1,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    // Institutional & Subscription Tracker
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'basic', 'standard', 'premium', 'monthly', 'yearly'],
      default: 'free',
    },
    planExpiresAt: {
      type: Date,
      default: null,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
