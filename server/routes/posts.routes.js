import { Router } from "express";
import {
  getPost,
  createPost,
  updatePost,
  removePost,
  getPosts,
} from "../controllers/posts.controllers.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/posts", getPosts);

router.get("/posts/:id", getPost);

router.post("/posts", [verifyToken, isModerator], createPost);

router.put("/posts/:id", [verifyToken, isModerator], updatePost);

router.delete("/posts/:id", [verifyToken, isAdmin], removePost);

export default router;