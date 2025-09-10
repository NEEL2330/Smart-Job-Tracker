import { getAllJobs, addJob, EditStatus , getJobbycompany, editJob, deleteJob} from "../models/jobModel.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await getAllJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getJobscompany = async (req, res) => {
  try {
    const jobs = await getJobbycompany(req.params);
    if(jobs.length === 0){
      return res.status(404).json({message : "No job detail found"})
    }
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
    
export const createJob = async (req, res) => {
  try {
    const id = await addJob(req.body);
    res.json({ message: "Job added successfully", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatestatus = async (req, res) => {
  try {
    const id = await EditStatus({id: req.params.id, ...req.body});
    if(id === 0){
      return res.status(404).json({message : "Job not found"});
    }
    res.json({ message: "Successfully Updated "});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const affectedRows = await editJob({ id: req.params.id, ...req.body });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletejobs = async (req, res) => {
  try {
    const affectedRows = await deleteJob(req.params);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
