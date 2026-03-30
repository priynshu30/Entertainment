const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaId: { type: String, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
  title: { type: String, required: true },
  thumbnail: { type: String },
  year: { type: String },
  rating: { type: String },
  isBookmarked: { type: Boolean, default: true },
  isSeen: { type: Boolean, default: false },
  seenAt: { type: Date, default: null }
}, { timestamps: true });

bookmarkSchema.index({ userId: 1, mediaId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
