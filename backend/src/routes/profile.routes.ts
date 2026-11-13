import { Router } from "express";
import * as c from "../controllers/profile.controller";

const router = Router();
router.get("/", c.get);
router.put("/", c.update);
export default router;
