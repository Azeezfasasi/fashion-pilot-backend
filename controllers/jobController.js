const Job = require('../models/Job');
const Application = require('../models/Application');

exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, salary, contract, experience } = req.body;
    const job = new Job({
      title,
      description,
      requirements,
      location,
      salary,
      contract,
      experience,
      employer: req.user.id,
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  const { keyword, location } = req.query;
  let filter = {};
  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ];
  }
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  const jobs = await Job.find(filter).populate('employer');
  res.json(jobs);
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name company');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user.id });
    if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });
    await Application.deleteMany({ job: job._id });
    res.json({ message: 'Job and related applications deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
