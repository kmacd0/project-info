const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectCode: { type: String, required: false },
  projectName: { type: String, required: true },
  projectDueDate: { type: String, required: true },
  projectStatus: { type: String, required: true },
  projectMember: { type: String, default: '' },
  projectNote: { type: String, default: '' },
  projectDetails: {
    projectMember: { type: String, default: '' },
    projectNote: { type: String, default: '' },
  },
});

// Create and export the model
module.exports = mongoose.model('Project', projectSchema, 'Projects');
