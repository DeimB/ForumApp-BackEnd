import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./src/router/user.js";
import questionRouter from "./src/router/question.js";
import answerRouter from "./src/router/answer.js";

const app = express();

app.use(cors());

mongoose
  .connect(process.env.MONGO_DB_CONNECTION)
  .then(() => console.log("Connected to DB"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.use(userRouter);
app.use(questionRouter);
app.use(answerRouter);

app.use((req, res) => {
  res.status(404).json({ message: "This endpoint does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
