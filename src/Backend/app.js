import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import homeRouter from "./routes/home.routes.js";
import authRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json({ limit: "16kb" })); // used to parse json data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // used to parse url-encoded data
app.use(cookieParser());
dotenv.config({ path: "./src/Backend/.env" });

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  method: ["GET", "POST"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

// ---------------------- DEPLOYMENT ----------------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname1, "/src/Frontend")));

  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "src/Frontend/index.html"));
  });

  app.get("/u/auth", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "src/Frontend/auth.html"));
  });
}

// ---------------------- DEPLOYMENT ----------------------

app.use("/", homeRouter);
app.use("/u", authRouter);

export { app };

/* ======== NOTES ======== */
/*

01 - Why does dotenv config path is './src/.env' and not './.env'?
Ans: Here's how the resolution works:
  - The './src/Backend/.env' path is relative to the current working directory.
  - When you execute your Node.js script, the current working directory is the directory from which you run the script.

*/
