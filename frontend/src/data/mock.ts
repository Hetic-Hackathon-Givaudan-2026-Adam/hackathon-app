import { Droplet, Leaf, Wind } from "lucide-react";
import type { Order, Project, Sample } from "../types";

// Données de démonstration : à remplacer plus tard par des appels à l'API.

export const PROJECTS: Project[] = [
  { id: "1", title: "Limonade gingembre-yuzu", category: "Goût", modified: "Modifié aujourd'hui", status: "En discussion", tone: "warning", icon: Droplet },
  { id: "2", title: "Thé glacé basilic", category: "Saveur", modified: "Modifié le 12 juin", status: "Échantillons en cours", tone: "warning", icon: Leaf },
  { id: "3", title: "Tonic fleurs blanches", category: "Senteur", modified: "Modifié le 28 mai", status: "Validé", tone: "success", icon: Wind },
];

export const SAMPLES: Sample[] = [
  { id: "1", name: "Thé glacé basilic — V1", delivery: "Livraison prévue le 21 juin", status: "En livraison", tone: "warning" },
];

export const ORDERS: Order[] = [
  { id: "1", reference: "CMD-2025-0418", product: "Tonic fleurs blanches", quantity: "25 kg", status: "Confirmée", tone: "success" },
];

export const USER = {
  firstName: "Claire",
  fullName: "Claire Lenoir",
  initials: "CL",
  company: "Maison Lenoir",
  companyInitials: "ML",
};
