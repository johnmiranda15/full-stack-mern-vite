import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { SECRET } from "../config.js";

export const signupHandler = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Creating a new User Object
    const newUser = new User({
      username,
      email,
      password,
    });

    // Checking for roles
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    // Saving the User Object in MongoDB
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign({ id: savedUser._id }, SECRET, {
      expiresIn: 86400, // 24 hours
    });

    // Setting the token in cookies
    res.cookie("token", token, { httpOnly: true });

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const signinHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que email y password están presentes
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Buscar usuario por email
    const userFound = await User.findOne({ email }).populate("roles");

    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    // Comparar la contraseña
    const matchPassword = await User.comparePassword(password, userFound.password);

    if (!matchPassword) {
      return res.status(401).json({
        token: null,
        message: "Invalid password",
      });
    }

    // Generar el token
    const token = jwt.sign({ id: userFound._id }, SECRET, {
      expiresIn: 86400, // 24 horas
    });

    // Configurar el token en una cookie (opcional)
    res.cookie("token", token, { httpOnly: true });

    // Responder con éxito
    res.json({
      message: "Signin successful",
      token,
    });
  } catch (error) {
    console.error("Error during signin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};