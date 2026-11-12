# Données du projet

## Leffingwell

Les fichiers `molecules.csv` et `stimuli.csv` proviennent de l’archive Leffingwell de Pyrfume. `echantillon_leffingwell.csv` est un extrait de 10 profils utilisé pour tester la proximité olfactive dans Orange. [Archive Pyrfume](https://github.com/pyrfume/pyrfume-data/tree/main/leffingwell)

**Source et attribution.** Benjamin Sanchez-Lengeling, Jennifer N. Wei, Brian K. Lee, Richard Gerkin, Alán Aspuru-Guzik et Alexander B. Wiltschko (2020), *Leffingwell Odor Dataset*, d’après la base Leffingwell PMP 2001. Les données sont utilisées pour la démonstration pédagogique du hackathon, selon la licence CC BY-NC. [Jeu de données original](https://doi.org/10.5281/zenodo.4085098) · [Licence Creative Commons](https://creativecommons.org/licenses/by-nc/4.0/deed.fr)

## Online Retail II

[Échantillon d’historique de commandes](echantillon_online_retail_ii.csv). Il contient 11 lignes d’articles issues de 4 commandes complètes de 2 clients. Pour chacun, l’extrait sélectionne deux commandes passées à des dates distinctes et contenant au moins un article en commun. Les transactions proviennent d’un vendeur britannique d’articles cadeaux. [Daqing Chen (2012), *Online Retail II*, UCI](https://doi.org/10.24432/C5CG6D) · [Licence CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.fr)

**Test Orange.** Relier **File → Select Rows → Data Table**. Appliquer les critères `client_id = 16029` et `code_article = 84880`. Le tableau affiche deux lignes sans valeur manquante.

| Commande | Date | Quantité |
|---|---|---:|
| `536386` | 1ᵉʳ décembre 2010 | 36 |
| `536831` | 2 décembre 2010 | 12 |

Ce test montre comment retrouver une référence déjà achetée et les quantités de ses commandes passées. Il sert de preuve pour le parcours de réassort de la thématique 2.
