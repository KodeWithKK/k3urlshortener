import { Router } from "express";
import {
  shortUrlHandler,
  redirectUrlHandler,
} from "../controller/home.controller.js";

const router = Router();

router.route("/").post(shortUrlHandler);
router.route("/:shortId").get(redirectUrlHandler);

export default router;
