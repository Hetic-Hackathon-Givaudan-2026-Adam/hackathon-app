// Mêmes formes que les types du frontend (src/types/index.ts), sans les icônes.
export type Tone = "warning" | "success";
export type ProjectKind = "Goût" | "Saveur" | "Senteur";
export type Lang = "fr" | "en";

export interface Project {
  id: string;
  title: string;
  category: ProjectKind;
  modified: string;
  status: string;
  tone: Tone;
  brief?: string;
}

export interface Sample {
  id: string;
  ref: string;
  project: string;
  version: number;
  orderedOn: string;
  step: 1 | 2 | 3; // 1 envoyée · 2 en livraison · 3 reçue
}

export interface Order {
  id: string;
  reference: string;
  project: string;
  date: string;
  status: string;
  tone: Tone;
}

export interface Profile {
  company: string;
  contact: string;
  email: string;
  phone: string;
  lang: Lang;
  notifications: { samples: boolean; orders: boolean; news: boolean };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
