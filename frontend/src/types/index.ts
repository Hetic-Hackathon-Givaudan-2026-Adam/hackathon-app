import type { LucideIcon } from "lucide-react";

export type Lang = "fr" | "en";
export type ViewState = "list" | "empty" | "loading" | "error";
export type Tone = "warning" | "success";
export type ProjectKind = "Goût" | "Saveur" | "Senteur";

export interface LayoutCtx {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  modified: string;
  status: string;
  tone: Tone;
  icon: LucideIcon;
}

export interface Sample {
  id: string;
  ref: string;
  project: string;
  version: number;
  orderedOn: string;
  step: 1 | 2 | 3;
}

export interface Order {
  id: string;
  reference: string;
  project: string;
  date: string;
  status: string;
  tone: Tone;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
