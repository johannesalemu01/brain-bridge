const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');
const { protect } = require('../middleware/auth.middleware');

// Groups
router.post('/groups', protect, communityController.createGroup);
router.get('/groups', protect, communityController.getGroups);
router.post('/groups/:groupId/join', protect, communityController.joinGroup);

// Posts
router.post('/groups/:groupId/posts', protect, communityController.createPost);
router.get('/groups/:groupId/posts', protect, communityController.getPosts);
router.put('/posts/:postId/upvote', protect, communityController.upvotePost);
router.post('/posts/:postId/summarize', protect, communityController.summarizePost);

// Comments
router.post('/posts/:postId/comments', protect, communityController.createComment);

module.exports = router;
