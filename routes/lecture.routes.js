
import express from 'express';
import * as LecturesCtrl from '../controllers/lecture.controller.js';
import { authenticate } from '../middleweare/auth.middleware.js';

const router = express.Router();

// All lecture routes require valid token
router.use(authenticate);

router.post('/',     LecturesCtrl.createLecture);
router.get('/',      LecturesCtrl.getAllLectures);
router.get('/:id',   LecturesCtrl.getLectureById);
router.put('/:id',   LecturesCtrl.updateLecture);
router.delete('/:id',LecturesCtrl.deleteLecture);

export default router;
