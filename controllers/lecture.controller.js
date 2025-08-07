// controllers/lecture.controller.js
import { Lecture } from '../models/lecture.model.js';

// Helper to pull YouTube ID
const extractYouTubeId = url => {
  const m = url.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

// Create Lecture
export const createLecture = async (req, res) => {
  try {
    const { title, description, videoUrl, category, duration, tags } = req.body;
    const youtubeId = extractYouTubeId(videoUrl);
    if (!youtubeId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    const lecture = new Lecture({
      title, description, videoUrl, youtubeId, category,
      duration, tags, createdBy: req.user.userId
    });
    await lecture.save();
    res.status(201).json(lecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Lectures
export const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find().populate('createdBy','username email');
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One Lecture
export const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate('createdBy','username');
    if (!lecture) return res.status(404).json({ error: 'Not found' });
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Lecture
export const updateLecture = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.videoUrl) {
      const youtubeId = extractYouTubeId(update.videoUrl);
      if (!youtubeId) return res.status(400).json({ error: 'Invalid YouTube URL' });
      update.youtubeId = youtubeId;
    }
    const lecture = await Lecture.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!lecture) return res.status(404).json({ error: 'Not found' });
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Lecture
export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);
    if (!lecture) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
