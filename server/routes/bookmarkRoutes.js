const express = require('express');
const { getBookmarks, getSeenMovies, addBookmark, removeBookmark, markAsSeen } = require('../controllers/bookmarkController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Specific routes must come before dynamic routes
router.get('/seen/list', authMiddleware, getSeenMovies);
router.get('/', authMiddleware, getBookmarks);
router.post('/', authMiddleware, addBookmark);
router.patch('/:mediaId/seen', authMiddleware, markAsSeen);
router.delete('/:mediaId', authMiddleware, removeBookmark);

module.exports = router;
