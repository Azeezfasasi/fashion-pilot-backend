const Application = require('../models/Application');
const Job = require('../models/Job');

// exports.applyToJob = async (req, res) => {
//   try {
//     const { jobId, coverLetter, resume } = req.body;
//     // Prevent duplicate applications
//     const existing = await Application.findOne({ candidate: req.user.id, job: jobId });
//     if (existing) return res.status(400).json({ error: 'Already applied to this job' });
//     const application = new Application({
//       candidate: req.user.id,
//       job: jobId,
//       coverLetter,
//       resume,
//     });
//     await application.save();
//     res.status(201).json(application);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     if (!jobId) return res.status(400).json({ error: 'jobId is required' });
//   }
// };
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;
    if (!jobId) return res.status(400).json({ error: 'jobId is required' }); // <-- Add this line
    // Prevent duplicate applications
    const existing = await Application.findOne({ candidate: req.user.id, job: jobId });
    if (existing) return res.status(400).json({ error: 'Already applied to this job' });
    const application = new Application({
      candidate: req.user.id,
      job: jobId,
      coverLetter,
      resume,
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email skills experience');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ error: 'Application not found' });
    // Only employer who owns the job can update
    if (String(application.job.employer) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEmployerApplications = async (req, res) => {
  try {
    // Find all jobs posted by this employer
    const jobs = await Job.find({ employer: req.user.id }).select('_id');
    const jobIds = jobs.map(j => j._id);
    // Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'name email skills experience')
      .populate('job');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

