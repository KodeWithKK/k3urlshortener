import { Router } from "express";
import {
  shortUrlHandler,
  getUrlHandler,
} from "../controller/home.controller.js";

const router = Router();

router.route("/").post(shortUrlHandler);
router.route("/:shortId").get(getUrlHandler);

export default router;
