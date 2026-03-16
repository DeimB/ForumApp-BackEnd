import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const generateAccessToken = (userId) => {
  const jwt_access_token = jwt.sign({ userId }, process.env.JWT_RANDOMISER, {
    expiresIn: "2h",
  });
  return jwt_access_token;
};

const generateRefreshToken = (userId) => {
  const jwt_refresh_token = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_RANDOMISER,
    {
      expiresIn: "1d",
    },
  );
  return jwt_refresh_token;
};

export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const capitalizedUserName = name.charAt(0).toUpperCase() + name.slice(1);

    name = capitalizedUserName;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = new UserModel({
      id: uuid(),
      name,
      email,
      password: hash,
    });
    await user.save();

    const jwt_access_token = generateAccessToken(user.id);
    const jwt_refresh_token = generateRefreshToken(user.id);

    res.status(201).json({
      message: "User registered successfully",
      jwt_token: jwt_access_token,
      jwt_refresh_token: jwt_refresh_token,
    });
  } catch {
    res.status(400).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "Incorrect email" });
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!isPasswordMatch) {
    return res.status(404).json({ message: "Incorrect password" });
  }

  const jwt_access_token = generateAccessToken(user.id);
  const jwt_refresh_token = generateRefreshToken(user.id);

  return res.status(200).json({
    message: "User successfully logged in",
    jwt_token: jwt_access_token,
    jwt_refresh_token: jwt_refresh_token,
  });
};
