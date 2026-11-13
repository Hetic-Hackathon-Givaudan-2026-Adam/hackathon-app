import { Router } from "express";
import * as c from "../controllers/projects.controller";

const router = Router();
router.get("/", c.list);
router.post("/", c.create);
router.get("/:id", c.getOne);
export default router;
