import type { LucideIcon } from "lucide-react";

export type Lang = "fr" | "en";
export type ViewState = "list" | "empty" | "loading" | "error";
export type Tone = "warning" | "success";

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
  name: string;
  delivery: string;
  status: string;
  tone: Tone;
}

export interface Order {
  id: string;
  reference: string;
  product: string;
  quantity: string;
  status: string;
  tone: Tone;
}
