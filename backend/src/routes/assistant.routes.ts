import { Router } from "express";
import * as c from "../controllers/assistant.controller";

const router = Router();
router.post("/", c.chat);
export default router;
