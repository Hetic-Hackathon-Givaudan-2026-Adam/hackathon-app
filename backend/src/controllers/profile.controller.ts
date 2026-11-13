import type { Request, Response } from "express";
import { profile } from "../data/mock";

export const get = (_req: Request, res: Response) => {
  res.json(profile);
};

export const update = (req: Request, res: Response) => {
  const { company, contact, email, phone, lang, notifications } = req.body ?? {};

  if (email !== undefined && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "E-mail invalide" });
  if (lang !== undefined && lang !== "fr" && lang !== "en") return res.status(400).json({ error: "Langue invalide (fr ou en)" });

  if (typeof company === "string") profile.company = company;
  if (typeof contact === "string") profile.contact = contact;
  if (typeof email === "string") profile.email = email;
  if (typeof phone === "string") profile.phone = phone;
  if (lang) profile.lang = lang;
  if (notifications && typeof notifications === "object") {
    for (const k of ["samples", "orders", "news"] as const) {
      if (typeof notifications[k] === "boolean") profile.notifications[k] = notifications[k];
    }
  }
  res.json(profile);
};
