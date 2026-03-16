import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2–50 characters"),

  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number"),
];
