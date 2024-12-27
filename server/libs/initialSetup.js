import bcrypt from "bcryptjs";
import Role from "../models/Role.js";
import User from "../models/User.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } from "../config.js";

export const initializeDatabase = async () => {
  try {
    // Crear roles si no existen
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      const roles = await Promise.all([
        new Role({ name: "user" }).save(),
        new Role({ name: "moderator" }).save(),
        new Role({ name: "admin" }).save(),
      ]);
      console.log("Roles created:", roles.map((role) => role.name));
    } else {
      console.log("Roles already exist");
    }

    // Crear administrador si no existe
    const userFound = await User.findOne({ email: ADMIN_EMAIL });
    if (!userFound) {
      const adminRoles = await Role.find({ name: { $in: ["admin", "moderator"] } });
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      const newUser = await User.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        roles: adminRoles.map((role) => role._id),
      });

      console.log(`Admin user created: ${newUser.email}`);
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Llama a la función de inicialización
initializeDatabase();
