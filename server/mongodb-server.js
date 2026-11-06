const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Project = require('./models/project');

// Create the Express application
const app = express();

// Allow HTTP requests from Angular
app.use(cors({ origin: 'http://localhost:4200' }));

// Read JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/IT6203')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB error:', err));


// GET: Retrieve all projects
app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving projects'
        });
    }
});


// POST: Create a new project
app.post('/projects', async (req, res) => {
    try {
        const body = req.body;
        const projectData = {
            projectCode: body.projectCode,
            projectName: body.projectName,
            projectDueDate: body.projectDueDate,
            projectStatus: body.projectStatus,
            projectMember: body.projectMember || (body.projectDetails ? body.projectDetails.projectMember : ''),
            projectNote: body.projectNote || (body.projectDetails ? body.projectDetails.projectNote : ''),
            projectDetails: body.projectDetails || {
                projectMember: body.projectMember || '',
                projectNote: body.projectNote || ''
            }
        };

        const project = new Project(projectData);
        const saved = await project.save();

        console.log('Project saved to MongoDB:', saved._id);
        res.status(201).json(saved);
    } catch (err) {
        console.error('Error saving project:', err.message);
        res.status(400).json({
            message: 'Error saving project',
            error: err.message
        });
    }
});


// GET: Retrieve a project by ID
app.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.status(200).json(project);
    } catch (err) {
        res.status(400).json({
            message: 'Invalid project ID'
        });
    }
});


// PUT: Update an existing project
app.put('/projects/:id', async (req, res) => {
    try {
        const body = req.body;
        const updateData = {
            ...body,
            projectMember: body.projectMember || (body.projectDetails ? body.projectDetails.projectMember : undefined),
            projectNote: body.projectNote || (body.projectDetails ? body.projectDetails.projectNote : undefined)
        };

        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        console.log('Project updated in MongoDB:', req.params.id);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({
            message: 'Error updating project',
            error: err.message
        });
    }
});


// DELETE: Remove a project
app.delete('/projects/:id', async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(
            req.params.id
        );

        if (!deleted) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        console.log('Project deleted from MongoDB:', req.params.id);
        res.status(200).json({
            message: 'Project deleted successfully'
        });
    } catch (err) {
        res.status(400).json({
            message: 'Error deleting project'
        });
    }
});


// Start the Express server
app.listen(8001, () => {
    console.log('MongoDB server running on port 8001');
});