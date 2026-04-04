const Group = require('../models/Group');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { summarizeThread } = require('../services/gemini.service');

// Create a new group
exports.createGroup = async (req, res, next) => {
  try {
    const { name, description, category, tags } = req.body;
    const group = await Group.create({
      name,
      description,
      category,
      tags,
      adminId: req.user._id,
      memberIds: [req.user._id], // Admin is automatically a member
    });
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

// Get all available groups
exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find().populate('adminId', 'name');
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};

// Join a specific group
exports.joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    
    // Check if user is already a member
    if (!group.memberIds.includes(req.user._id)) {
      group.memberIds.push(req.user._id);
      await group.save();
    }
    
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

// Create a new post in a group
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, type } = req.body;
    const post = await Post.create({
      groupId: req.params.groupId,
      authorId: req.user._id,
      title,
      content,
      type: type || 'discussion'
    });
    
    await post.populate('authorId', 'name avatar');
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Get posts for a specific group
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ groupId: req.params.groupId })
      .populate('authorId', 'name avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

// Upvote a post
exports.upvotePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.upvotedBy.includes(req.user._id)) {
      // Remove upvote
      post.upvotedBy.pull(req.user._id);
      post.upvoteCount--;
    } else {
      // Add upvote
      post.upvotedBy.push(req.user._id);
      post.upvoteCount++;
      
      // Update Author Reputation (Simple logic for Phase 1)
      const User = require('../models/User');
      await User.findByIdAndUpdate(post.authorId, { $inc: { reputationPoints: 5 } });
    }

    await post.save();
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Create a comment on a post
exports.createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      postId: req.params.postId,
      authorId: req.user._id,
      content
    });
    
    await comment.populate('authorId', 'name avatar role');
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// Summarize a post thread using AI
exports.summarizePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    const comments = await Comment.find({ postId: req.params.postId }).populate('authorId', 'name');
    
    const formattedComments = comments.map(c => ({
      authorName: c.authorId?.name || 'Unknown',
      content: c.content
    }));

    const summary = await summarizeThread({
      title: post.title,
      content: post.content,
      comments: formattedComments
    });

    res.status(200).json({ success: true, data: { summary } });
  } catch (error) {
    next(error);
  }
};
