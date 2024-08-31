import { Problem } from "../models/problem.js";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Signup Controller
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(1);
  try {
    // Check if the user already exists
    console.log(2);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    console.log(3);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(4);
    // Create a new user
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

export const addProblem = async (req, res) => {
  const { title, description, token } = req.body;

  try {
    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Create a new problem
    const problem = await Problem.create({ title, description });

    // Find the user and add the problem to their problems array
    await User.findByIdAndUpdate(userId, { $push: { problems: problem._id } });

    res.status(201).json({ problem });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

export const getUserProblems = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    // Find the user by ID and populate the 'problems' field
    const user = await User.findById(userId).populate("problems");

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the user's problems
    res.status(200).json({ problems: user.problems });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error });
  }
};
