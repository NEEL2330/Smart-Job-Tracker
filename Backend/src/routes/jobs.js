import express from "express";
import {getJobs, createJob , updatestatus, getJobscompany, updateJob, deletejobs} from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getJobs);
router.post("/", createJob);
router.put("/:id", updatestatus);
router.get("/company/:company", getJobscompany);
router.put("/edit/:id", updateJob); 
router.delete("/delete/:id", deletejobs); 

export default router;
