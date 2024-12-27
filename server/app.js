import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRoles } from './libs/initialSetup.js'; 
import postRoutes from './routes/posts.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
createRoles();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  fileUpload({
    tempFileDir: "./upload",
    useTempFiles: true,
  })
);

app.use(express.static(path.join(__dirname, '../client/dist')));

// Routes
app.use("/api", postRoutes);
app.use("/api/auth", authRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
})

export { app };