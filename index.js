import express from "express";
import connectDB from "./db/connectDb.js";
import "dotenv/config";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser());
const PORT = process.env.PORT;

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
