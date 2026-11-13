import type { Request, Response } from "express";
import { orders } from "../data/mock";

export const list = (_req: Request, res: Response) => {
  res.json(orders);
};

export const getOne = (req: Request, res: Response) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Commande introuvable" });
  res.json(order);
};
