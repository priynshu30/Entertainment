const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock Storage for users (for testing without MongoDB)
const mockUsers = new Map();

exports.signup = async (req, res) => {
  try {
    const { email, password, profileImage } = req.body;
    
    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
        console.warn('DB not connected. Using Mock Signup.');
        if (mockUsers.has(email)) return res.status(400).json({ message: 'User already exists (Mock)' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = { id: Date.now().toString(), email, password: hashedPassword, profileImage };
        mockUsers.set(email, newUser);
        
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, profileImage: newUser.profileImage } });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ email, password, profileImage });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, profileImage: user.profileImage } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
        console.warn('DB not connected. Using Mock Login.');
        const user = mockUsers.get(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials (Mock)' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials (Mock)' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return res.json({ token, user: { id: user.id, email: user.email, profileImage: user.profileImage } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email, profileImage: user.profileImage } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
