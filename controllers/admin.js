import { Problem } from "../models/problem.js";

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    if (!problems.length) {
      return res.status(404).json({ message: "No problems found." });
    }
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { pid, status } = req.body;

    // Check if the status is one of the allowed enum values
    const allowedStatuses = ["PENDING", "ONGOING", "COMPLETED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const problem = await Problem.findById(pid);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found." });
    }

    problem.status = status;
    await problem.save();

    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
