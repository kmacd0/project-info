const cors = require('cors');

const express = require('express');

// Create the Express application.
const app = express();

// Allow requests from Angular.
app.use(
  cors({
    origin: 'http://localhost:4200',
  }),
);

// Parse incoming JSON request bodies.
app.use(express.json());

const PORT = 8000;

// Respond to requests at the home URL.
app.get('/', (req, res) => {
  res.send('Project Progress Tracker API is running!');
});

// Retrieve milestone records.
app.get('/projects', (req, res) => {
  console.log('GET request received for milestones');

  // Return milestone data as JSON.
  res.status(200).json(projects);
});

// Receive milestone information from Angular.
app.post('/projects', (req, res) => {
  const { projectCode, projectName, projectDueDate, projectStatus, projectDetails, name, status } =
    req.body;

  const resolvedName = projectName || name;
  const resolvedStatus = projectStatus || status;

  // Display the submitted information.
  console.log('New project received:');
  console.log('Project Code:', projectCode);
  console.log('Name:', resolvedName);
  console.log('Due Date:', projectDueDate);
  console.log('Status:', resolvedStatus);
  console.log('Details:', projectDetails);

  // Return a confirmation.
  res.status(200).json({
    message: 'Project received successfully!',
    project: req.body,
  });
});

// Start the server.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Sample milestone records stored in memory.
const milestones = [
  {
    id: 1,
    name: 'Create Angular Components',
    status: 'Completed',
  },
  {
    id: 2,
    name: 'Implement Reactive Forms',
    status: 'Completed',
  },
  {
    id: 3,
    name: 'Develop Express Backend',
    status: 'In Progress',
  },
];
