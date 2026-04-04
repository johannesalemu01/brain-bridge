const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['discussion', 'qna'],
      default: 'discussion',
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title too long'],
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    attachments: [
      {
        url: String,
        type: { type: String }, // e.g., 'image/png' or 'application/pdf'
        name: String,
      },
    ],
    upvoteCount: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isResolved: {
      type: Boolean,
      default: false,
    },
    bestAnswerCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
