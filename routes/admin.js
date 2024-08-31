import express from "express";
import { getAllProblems, updateStatus } from "../controllers/admin.js";

const router = express();

router.route("/getallproblems").get(getAllProblems);
router.route("/updateproblem").patch(updateStatus);
export default router;
