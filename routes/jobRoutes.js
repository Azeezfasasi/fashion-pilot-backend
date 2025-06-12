const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public GET /api/jobs
router.get('/', jobController.getJobs);
// Public GET /api/jobs/:id - Get a single job by ID
router.get('/:id', jobController.getJob);

// Employer only
// POST /api/jobs - Create a new job
router.post('/', auth, role(['employer']), jobController.createJob);
// PUT /api/jobs/:id - Update a job
router.put('/:id', auth, role(['employer']), jobController.updateJob);
// DELETE /api/jobs/:id - Delete a job
router.delete('/:id', auth, role(['employer']), jobController.deleteJob);
// GET /api/jobs/employer/my - Get all jobs posted by the employer
router.get('/employer/my', auth, role(['employer']), jobController.getEmployerJobs);

module.exports = router;
