// controllers/emailTemplate.controller.js
import { EmailTemplate } from '../models/emailTemplates.model.js'; // Mongoose model for email templates

/**
 * @desc    Create a new email template
 * @route   POST /email
 * @access  Protected
 */
export const createTemplate = async (req, res, next) => {
  try {
    // Instantiate a new EmailTemplate document from request body
    const template = new EmailTemplate(req.body);
    // Save the document to MongoDB
    await template.save();
    // Respond with the created template and 201 status
    return res.status(201).json({ success: true, data: template });
  } catch (err) {
    // On error, pass to error handler or send generic message
    console.error('Create Template Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Retrieve all active email templates
 * @route   GET /email
 * @access  Protected
 */
export const getAllTemplates = async (req, res, next) => {
  try {
    // Fetch all templates from MongoDB
    const templates = await EmailTemplate.find();
    // Respond with array of templates
    return res.status(200).json({ success: true, data: templates });
  } catch (err) {
    console.error('Get All Templates Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Retrieve a single template by its key (type)
 * @route   GET /email/:key
 * @access  Protected
 */
export const getTemplateByKey = async (req, res, next) => {
  try {
    // Find template by unique 'type' field
    const template = await EmailTemplate.findOne({ type: req.params.key });
    if (!template) {
      // If not found, return 404
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    // Respond with found template
    return res.status(200).json({ success: true, data: template });
  } catch (err) {
    console.error('Get Template By Key Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Update an existing email template by key
 * @route   PUT /email/:key
 * @access  Protected
 */
export const updateTemplate = async (req, res, next) => {
  try {
    // Find and update document, return the new one
    const updated = await EmailTemplate.findOneAndUpdate(
      { type: req.params.key },   // Query filter by type
      req.body,                   // New values from request body
      { new: true, runValidators: true } // Options: return updated doc & run schema validators
    );
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    // Respond with updated document
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('Update Template Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Delete an email template by key
 * @route   DELETE /email/:key
 * @access  Protected
 */
export const deleteTemplate = async (req, res, next) => {
  try {
    // Find and delete document by type
    const deleted = await EmailTemplate.findOneAndDelete({ type: req.params.key });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    // Respond with success message
    return res.status(200).json({ success: true, message: 'Template deleted' });
  } catch (err) {
    console.error('Delete Template Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};


