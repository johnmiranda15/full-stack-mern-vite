import bcrypt from "bcryptjs";
import Role from "../models/Role.js";
import User from "../models/User.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } from "../config.js";

export const initializeDatabase = async () => {
  try {
    // Crear roles si no existen
    const roleCount = await Role.estimatedDocumentCount();
    if (roleCount > 0) {
      const roles = await Promise.all([
        new Role({ name: "user" }).save(),
        new Role({ name: "moderator" }).save(),
        new Role({ name: "admin" }).save(),
      ]);
      console.log("Roles created:", roles.map((role) => role.name));
    } else {
      console.log("Roles are already initialized.");
    }

    // Verificar si el usuario administrador ya existe
    const userFound = await User.findOne({
      $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }],
    });

    if (userFound) {
      console.log(`Admin user already exists: ${userFound.email}`);
      return;
    }

    // Obtener roles de administrador y moderador
    const roles = await Role.find({ name: { $in: ["admin", "moderator"] } });

    // Encriptar la contraseña del administrador
    const hashedPassword = bcrypt.hash(ADMIN_PASSWORD, 10);

    // Crear un nuevo usuario administrador
    const newUser = await User.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      roles: roles.map((role) => role._id),
    });

    console.log(`Admin user created: ${newUser.email}`);
  } catch (error) {
    if (error.code === 11000) {
      console.log(
        "Duplicate key error:",
        error.keyValue,
        "- A user with this key already exists."
      );
    } else {
      console.error("Error initializing database:", error);
    }
  }
};
