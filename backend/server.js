import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { startBot, stopBot } from "./bot.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/start-bot", (req, res) => res.json({ message: startBot() }));
app.post("/stop-bot", (req, res) => res.json({ message: stopBot() }));

app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));
