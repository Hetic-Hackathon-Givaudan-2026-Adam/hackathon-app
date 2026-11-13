import { Droplet, Leaf, Wind } from "lucide-react";
import type { Order, Project, Sample } from "../types";

// Données de démonstration : à remplacer plus tard par des appels à l'API.

export const PROJECTS: Project[] = [
  { id: "1", title: "Limonade gingembre-yuzu", category: "Goût", modified: "Modifié aujourd'hui", status: "En discussion", tone: "warning", icon: Droplet },
  { id: "2", title: "Thé glacé basilic", category: "Saveur", modified: "Modifié le 12 juin", status: "Échantillons en cours", tone: "warning", icon: Leaf },
  { id: "3", title: "Tonic fleurs blanches", category: "Senteur", modified: "Modifié le 28 mai", status: "Validé", tone: "success", icon: Wind },
];

export const STEP_LABELS = ["Commande envoyée", "En cours de livraison", "Reçu"];

export const SAMPLES: Sample[] = [
  { id: "1", ref: "ECH-2025-0618", project: "Limonade gingembre-yuzu", version: 1, orderedOn: "18 juin 2025", step: 1 },
  { id: "2", ref: "ECH-2025-0531", project: "Thé glacé basilic", version: 1, orderedOn: "31 mai 2025", step: 2 },
  { id: "3", ref: "ECH-2025-0412", project: "Tonic fleurs blanches", version: 2, orderedOn: "12 avril 2025", step: 3 },
];

export const ORDERS: Order[] = [
  { id: "1", reference: "CMD-2025-0624", project: "Limonade gingembre-yuzu", date: "27 juin 2025", status: "Confirmée", tone: "success" },
  { id: "2", reference: "CMD-2025-0418", project: "Tonic fleurs blanches", date: "18 avril 2025", status: "Livrée", tone: "success" },
  { id: "3", reference: "CMD-2025-0212", project: "Soda poire-romarin", date: "12 février 2025", status: "Livrée", tone: "success" },
];

export const USER = {
  firstName: "Claire",
  fullName: "Claire Lenoir",
  initials: "CL",
  company: "Maison Lenoir",
  companyInitials: "ML",
  email: "claire@maisonlenoir.fr",
  phone: "+33 6 12 34 56 78",
};
