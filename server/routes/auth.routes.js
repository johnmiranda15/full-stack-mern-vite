import { Router } from "express";
import {
  signinHandler,
  signupHandler,
  signoutHandler,
  profileHandler
} from "../controllers/auth.controller.js";
import {
  checkExistingRole,
  checkExistingUser,
} from "../middlewares/verifySignup.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup", [checkExistingUser, checkExistingRole], signupHandler);

router.post("/signin", signinHandler);

router.post("/signout", signoutHandler);

router.get("/profile", profileHandler);

export default router;