import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser';
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/posts.routes.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
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
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.set("json spaces", 4);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
})

export { app };