import db from "../config/db.js";

export const getAllJobs = async () => {
    const [rows] = await db.query("SELECT * FROM jobs");
    return rows;
};

export const getJobbycompany = async (job) => {
    const {company} = job
    const [rows] = await db.query("SELECT * FROM jobs WHERE LOWER(company) = LOWER(?)", [company]);
    return rows;
};

export const addJob = async (job) => {
    const { company, role, location, status } = job;
    const [result] = await db.query(
        "INSERT INTO jobs (company, role, location, status) VALUES (?, ?, ?, ?)",
        [company, role, location, status]
    );
    return result.insertId;
};

export const EditStatus = async (job) => {
    const { id, status } = job;
    const[result] = await db.query(
        "UPDATE jobs SET status = ? WHERE id = ?",
        [status, id]
    )
    return result.affectedRows;
};

export const editJob = async (job) => {
  const { id, company, role, location, status } = job;
  const [result] = await db.query(
    "UPDATE jobs SET company = ?, role = ?, location = ?, status = ? WHERE id = ?",
    [company, role, location, status, id]
  );
  return result.affectedRows;
};

export const deleteJob = async (job) => {
  const{id} = job
  const [result] = await db.query(
    "DELETE FROM jobs WHERE id =?",[id]
  );
  return result.affectedRows;
};
