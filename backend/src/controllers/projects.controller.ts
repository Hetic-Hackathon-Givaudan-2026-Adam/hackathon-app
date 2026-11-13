import type { Request, Response } from "express";
import { projects } from "../data/mock";
import type { Project, ProjectKind } from "../types";

const KINDS: ProjectKind[] = ["Goût", "Saveur", "Senteur"];

export const list = (_req: Request, res: Response) => {
  res.json(projects);
};

export const getOne = (req: Request, res: Response) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Projet introuvable" });
  res.json(project);
};

export const create = (req: Request, res: Response) => {
  const { name, kind, brief } = req.body ?? {};
  if (typeof name !== "string" || !name.trim()) return res.status(400).json({ error: "Le nom du projet est obligatoire" });
  if (!KINDS.includes(kind)) return res.status(400).json({ error: `Le type doit être : ${KINDS.join(", ")}` });

  const project: Project = {
    id: String(Date.now()),
    title: name.trim(),
    category: kind,
    modified: "Modifié aujourd'hui",
    status: "En discussion",
    tone: "warning",
    brief: typeof brief === "string" ? brief : undefined,
  };
  projects.unshift(project);
  res.status(201).json(project);
};
