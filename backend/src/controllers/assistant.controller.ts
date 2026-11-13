import type { NextFunction, Request, Response } from "express";
import { getReply } from "../services/assistant.service";
import type { ChatMessage } from "../types";

export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages, project = {}, lang = "fr" } = req.body ?? {};
    const valid =
      Array.isArray(messages) &&
      messages.length > 0 &&
      messages.every((m: ChatMessage) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string");
    if (!valid) return res.status(400).json({ error: "messages invalides" });

    res.json(await getReply(messages, project, lang === "en" ? "en" : "fr"));
  } catch (e) {
    next(e);
  }
};
