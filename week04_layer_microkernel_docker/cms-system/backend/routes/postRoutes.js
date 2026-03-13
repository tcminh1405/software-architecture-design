const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { authMiddleware, checkRole } = require('../middleware/auth');

router.post('/', authMiddleware, checkRole('Admin', 'Editor'), createPost);
router.get('/', authMiddleware, getPosts);
router.get('/:id', authMiddleware, getPostById);
router.put('/:id', authMiddleware, checkRole('Admin', 'Editor'), updatePost);
router.delete('/:id', authMiddleware, checkRole('Admin'), deletePost);

module.exports = router;
