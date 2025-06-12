const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const parser = require('../config/multer');

// Candidate applies to job POST /api/applications/apply
router.post('/apply', auth, role(['candidate', 'employer']), applicationController.applyToJob);

// Upload resume for job POST /api/applications/apply
router.post('/apply', auth, role(['candidate', 'employer']), parser.single('resume'), applicationController.applyToJob);

// Employer GET /api/applications/employer/all
router.get('/employer/all', auth, role('employer'), applicationController.getAllEmployerApplications);
// Candidate views their applications GET /api/applications/my
router.get('/my', auth, role(['candidate']), applicationController.getCandidateApplications);
// Employer views applications for a job GET /api/applications/job/:jobId
router.get('/job/:jobId', auth, role(['employer']), applicationController.getApplicationsForJob);
// Employer updates application status PUT /api/applications/:id/status
router.put('/:id/status', auth, role(['employer']), applicationController.updateApplicationStatus);

module.exports = router;
