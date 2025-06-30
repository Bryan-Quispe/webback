const express = require('express');
const Qualification = require('../models/Qualification');
const router = express.Router();

// Get all qualifications
router.get('/qualifications', async (req, res) => {
  try {
    const qualifications = await Qualification.find();
    res.json(qualifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch qualifications' });
  }
});

// Get qualification by ID
router.get('/qualification/:id', async (req, res) => {
  try {
    const qualification = await Qualification.findOne({ qualificationId: req.params.id });
    res.json(qualification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a qualification
router.post('/qualification', async (req, res) => {
  const newQualification = new Qualification({
    qualificationId: req.body.qualificationId,
    role: req.body.role,
    institution: req.body.institution,
    place: req.body.place,
    startYear: req.body.startYear,
    endYear: req.body.endYear,
    qualificationType: req.body.qualificationType,
    profileId: req.body.profileId,
  });

  try {
    const created = await newQualification.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a qualification
router.put('/qualification/update/:id', async (req, res) => {
  const updatedData = {
    role: req.body.role,
    institution: req.body.institution,
    place: req.body.place,
    startYear: req.body.startYear,
    endYear: req.body.endYear,
    qualificationType: req.body.qualificationType,
    profileId: req.body.profileId,
  };

  try {
    const updated = await Qualification.findOneAndUpdate(
      { qualificationId: req.params.id },
      updatedData,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a qualification
router.delete('/qualification/delete/:id', async (req, res) => {
  try {
    const deleted = await Qualification.deleteOne({ qualificationId: req.params.id });
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
