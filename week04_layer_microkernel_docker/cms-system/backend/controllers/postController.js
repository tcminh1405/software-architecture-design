const db = require('../config/database');

const createPost = async (req, res) => {
  try {
    const { title, content, status = 'Draft' } = req.body;
    const authorId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content required' });
    }

    const [result] = await db.query(
      'INSERT INTO posts (title, content, author_id, status) VALUES (?, ?, ?, ?)',
      [title, content, authorId, status]
    );

    const [posts] = await db.query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    
    res.status(201).json(posts[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let query = 'SELECT p.*, u.username as author_name FROM posts p JOIN users u ON p.author_id = u.id';
    const params = [];

    if (req.user.role === 'Viewer') {
      query += ' WHERE p.status = ?';
      params.push('Published');
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [posts] = await db.query(query, params);
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM posts');

    
    res.json({
      posts,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const [posts] = await db.query(
      'SELECT p.*, u.username as author_name FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?',
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(posts[0]);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const [posts] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.user.role !== 'Admin' && posts[0].author_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = [];
    const params = [];

    if (title) {
      updates.push('title = ?');
      params.push(title);
    }
    if (content) {
      updates.push('content = ?');
      params.push(content);
    }
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    updates.push('updated_at = NOW()');
    params.push(id);

    await db.query(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`, params);

    const [updatedPosts] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    res.json(updatedPosts[0]);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
