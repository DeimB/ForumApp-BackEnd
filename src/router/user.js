import express from "express";
import { register, login } from "../controller/user.js";

import auth from "../middleware/auth.js";

import { registerValidation } from "../validators/user.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);

router.post("/login", login);

router.get("/jwt/validate", auth, (req, res) => {
  res.status(200).json({ message: "JWT is valid" });
});

export default router;
