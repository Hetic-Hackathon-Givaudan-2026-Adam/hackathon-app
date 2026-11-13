import type { Request, Response } from "express";
import { samples } from "../data/mock";

export const list = (_req: Request, res: Response) => {
  res.json(samples);
};

export const getOne = (req: Request, res: Response) => {
  const sample = samples.find((s) => s.id === req.params.id);
  if (!sample) return res.status(404).json({ error: "Échantillon introuvable" });
  res.json(sample);
};
