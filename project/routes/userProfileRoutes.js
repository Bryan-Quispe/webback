const express = require('express');
const UserProfile = require('../models/UserProfile');
const router = express.Router();

// Get all user profiles
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await UserProfile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Get a user profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ profileId: req.params.id });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user profile
router.post('/profile', async (req, res) => {
  const newProfile = new UserProfile({
    profileId: req.body.profileId,
    title: req.body.title,
    bio: req.body.bio,
    address: req.body.address,
    profilePicture: req.body.profilePicture,
    accountId: req.body.accountId
  });

  try {
    const createdProfile = await newProfile.save();
    res.status(201).json(createdProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user profile
router.put('/profile/update/:id', async (req, res) => {
  const updatedData = {
    title: req.body.title,
    bio: req.body.bio,
    address: req.body.address,
    profilePicture: req.body.profilePicture,
    accountId: req.body.accountId
  };

  try {
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { profileId: req.params.id },
      updatedData,
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a user profile
router.delete('/profile/delete/:id', async (req, res) => {
  try {
    const deletedProfile = await UserProfile.deleteOne({ profileId: req.params.id });
    res.status(200).json(deletedProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload profile picture (you need multer config separately)
router.post('/profile/uploadImage/:id', async (req, res) => {
  try {
    const updated = await UserProfile.findOneAndUpdate(
      { profileId: req.params.id },
      { profilePicture: req.body.profilePicture },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
