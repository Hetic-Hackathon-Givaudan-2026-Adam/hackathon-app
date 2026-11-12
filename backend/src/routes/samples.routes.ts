import { Router } from "express";
import * as c from "../controllers/samples.controller";

const router = Router();
router.get("/", c.list);
router.get("/:id", c.getOne);
export default router;
