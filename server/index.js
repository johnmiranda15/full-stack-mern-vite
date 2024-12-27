import { app } from "./app.js";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";
import { initializeDatabase } from "./libs/initialSetup.js";

connectDB();
// Inicialización de base de datos
initializeDatabase();
app.listen(PORT);
console.log("Server on port", PORT);