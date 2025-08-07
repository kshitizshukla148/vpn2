
// routes/emailTemplate.routes.js
import express from 'express';
import {
  createTemplate,
  getAllTemplates,
  getTemplateByKey,
  updateTemplate,
  deleteTemplate
} from '../controllers/emailTemplate.controller.js';

const router = express.Router();

/**
 * @route   POST /email
 * @desc    Create new email template
 * @access  Protected
 */
router.post('/', createTemplate);

/**
 * @route   GET /email
 * @desc    Retrieve all email templates
 * @access  Protected
 */
router.get('/', getAllTemplates);

/**
 * @route   GET /email/:key
 * @desc    Retrieve a template by its key
 * @access  Protected
 */
router.get('/:key', getTemplateByKey);

/**
 * @route   PUT /email/:key
 * @desc    Update an existing template
 * @access  Protected
 */
router.put('/:key', updateTemplate);

/**
 * @route   DELETE /email/:key
 * @desc    Delete a template by its key
 * @access  Protected
 */
router.delete('/:key', deleteTemplate);

export default router;
