
import {User} from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
};


export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  generateToken(res, user._id);
  res.status(201).json(user);
};



export const logout = (req, res) => {
 res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
});

  res.status(200).json({ message: "Logged out successfully" });
};



export const getMe = async (req, res) => {
  const user = req.user;
  if (user.isBlocked) {
    return res.status(200).json({
      user: {
        _id: user._id,
        isBlocked: true,
      },
    });
  }

  res.status(200).json({
    user,
  });
};



export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  if (user.isBlocked) {
    return res.status(403).json({
      message: "Account blocked",
      isBlocked: true,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  generateToken(res, user._id);

  res.status(200).json({
    user,
  });
};
