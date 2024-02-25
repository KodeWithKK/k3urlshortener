import { Router } from "express";
import {
  loginHandler,
  signupHandler,
  getUserDataHandler,
  logoutHandler,
  removeUrlHandler,
  addUrlHandler,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/login").post(loginHandler);
router.route("/signup").post(signupHandler);

// secured route
router.route("/data").get(verifyJWT, getUserDataHandler);
router.route("/logout").post(verifyJWT, logoutHandler);
router.route("/a/:shortId").post(verifyJWT, addUrlHandler);
router.route("/r/:shortId").post(verifyJWT, removeUrlHandler);

export default router;
