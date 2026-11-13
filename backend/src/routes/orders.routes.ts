import { Router } from "express";
import * as c from "../controllers/orders.controller";

const router = Router();
router.get("/", c.list);
router.get("/:id", c.getOne);
export default router;
