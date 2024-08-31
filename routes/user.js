import express from "express";
import {
  addProblem,
  getUserProblems,
  login,
  signup,
} from "../controllers/user.js";

const router = express();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/addproblem").post(addProblem);
router.route("/getproblems").get(getUserProblems);
export default router;
