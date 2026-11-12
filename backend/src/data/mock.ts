import type { Order, Profile, Project, Sample } from "../types";

// Données en mémoire (réinitialisées à chaque redémarrage).
// Pour passer à MongoDB, remplacez ces tableaux par des modèles Mongoose.

export const projects: Project[] = [
  { id: "1", title: "Limonade gingembre-yuzu", category: "Goût", modified: "Modifié aujourd'hui", status: "En discussion", tone: "warning" },
  { id: "2", title: "Thé glacé basilic", category: "Saveur", modified: "Modifié le 12 juin", status: "Échantillons en cours", tone: "warning" },
  { id: "3", title: "Tonic fleurs blanches", category: "Senteur", modified: "Modifié le 28 mai", status: "Validé", tone: "success" },
];

export const samples: Sample[] = [
  { id: "1", ref: "ECH-2025-0618", project: "Limonade gingembre-yuzu", version: 1, orderedOn: "18 juin 2025", step: 1 },
  { id: "2", ref: "ECH-2025-0531", project: "Thé glacé basilic", version: 1, orderedOn: "31 mai 2025", step: 2 },
  { id: "3", ref: "ECH-2025-0412", project: "Tonic fleurs blanches", version: 2, orderedOn: "12 avril 2025", step: 3 },
];

export const orders: Order[] = [
  { id: "1", reference: "CMD-2025-0624", project: "Limonade gingembre-yuzu", date: "27 juin 2025", status: "Confirmée", tone: "success" },
  { id: "2", reference: "CMD-2025-0418", project: "Tonic fleurs blanches", date: "18 avril 2025", status: "Livrée", tone: "success" },
  { id: "3", reference: "CMD-2025-0212", project: "Soda poire-romarin", date: "12 février 2025", status: "Livrée", tone: "success" },
];

export const profile: Profile = {
  company: "Maison Lenoir",
  contact: "Claire Lenoir",
  email: "claire@maisonlenoir.fr",
  phone: "+33 6 12 34 56 78",
  lang: "fr",
  notifications: { samples: true, orders: true, news: false },
};
