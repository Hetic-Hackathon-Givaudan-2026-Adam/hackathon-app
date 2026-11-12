import { Router } from "express";
import projects from "./projects.routes";
import samples from "./samples.routes";
import orders from "./orders.routes";
import profile from "./profile.routes";
import assistant from "./assistant.routes";

const router = Router();
router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.use("/projects", projects);
router.use("/samples", samples);
router.use("/orders", orders);
router.use("/profile", profile);
router.use("/assistant", assistant);
export default router;
