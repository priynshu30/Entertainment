const Bookmark = require('../models/Bookmark');
const mongoose = require('mongoose');

// Mock Storage for bookmarks (in-memory, per session)
const mockBookmarks = new Map(); // userId -> bookmark objects[]

exports.getBookmarks = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
        console.warn('DB not connected. Using Mock getBookmarks.');
        const userBookmarks = mockBookmarks.get(req.user.id) || [];
        return res.json(userBookmarks);
    }
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSeenMovies = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
        console.warn('DB not connected. Using Mock getSeenMovies.');
        const userBookmarks = mockBookmarks.get(req.user.id) || [];
        const seenMovies = userBookmarks.filter(b => b.isSeen);
        return res.json(seenMovies);
    }
    const seenMovies = await Bookmark.find({ userId: req.user.id, isSeen: true });
    res.json(seenMovies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const { mediaId, mediaType, title, thumbnail, year, rating } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
        console.warn('DB not connected. Using Mock addBookmark.');
        let userBookmarks = mockBookmarks.get(req.user.id) || [];
        const existing = userBookmarks.find(b => b.mediaId === String(mediaId));
        if (existing) {
            existing.isBookmarked = true;
            mockBookmarks.set(req.user.id, userBookmarks);
            return res.status(201).json(existing);
        }
        const newBookmark = { 
            userId: req.user.id, 
            mediaId: String(mediaId), 
            mediaType, 
            title, 
            thumbnail, 
            year, 
            rating, 
            isBookmarked: true,
            isSeen: false,
            seenAt: null
        };
        userBookmarks.push(newBookmark);
        mockBookmarks.set(req.user.id, userBookmarks);
        return res.status(201).json(newBookmark);
    }

    let bookmark = await Bookmark.findOne({ userId: req.user.id, mediaId });
    if (bookmark) {
      bookmark.isBookmarked = true;
      await bookmark.save();
      return res.status(201).json(bookmark);
    }
    bookmark = new Bookmark({
      userId: req.user.id,
      mediaId,
      mediaType,
      title,
      thumbnail,
      year,
      rating,
      isBookmarked: true,
      isSeen: false
    });
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    const { mediaId } = req.params;
    
    if (mongoose.connection.readyState !== 1) {
        console.warn('DB not connected. Using Mock removeBookmark.');
        let userBookmarks = mockBookmarks.get(req.user.id) || [];
        const bookmark = userBookmarks.find(b => b.mediaId === String(mediaId));
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found (Mock)' });
        }
        bookmark.isBookmarked = false;
        mockBookmarks.set(req.user.id, userBookmarks);
        return res.json(bookmark);
    }

    const bookmark = await Bookmark.findOne({ userId: req.user.id, mediaId });
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    bookmark.isBookmarked = false;
    await bookmark.save();
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { isSeen } = req.body;

    if (mongoose.connection.readyState !== 1) {
        console.warn('DB not connected. Using Mock markAsSeen.');
        let userBookmarks = mockBookmarks.get(req.user.id) || [];
        let bookmark = userBookmarks.find(b => b.mediaId === String(mediaId));
        
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found (Mock)' });
        }
        
        bookmark.isSeen = isSeen;
        bookmark.seenAt = isSeen ? new Date() : null;
        mockBookmarks.set(req.user.id, userBookmarks);
        return res.json(bookmark);
    }

    let bookmark = await Bookmark.findOne({ userId: req.user.id, mediaId });
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    bookmark.isSeen = isSeen;
    bookmark.seenAt = isSeen ? new Date() : null;
    await bookmark.save();
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
