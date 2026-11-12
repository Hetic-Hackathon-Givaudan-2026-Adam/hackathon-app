# Gate 1 — Test de similarité olfactive

**Thématique 2 · Plateforme de commande Givaudan · 10 novembre 2026**

## Piste et données

**Piste Product.** Aider un client à retrouver une fragrance proche d’une référence connue. Le test Data vérifie si l’on peut classer des profils à partir des notes qu’ils partagent et expliquer le classement.

**Source et accès.** Accès confirmé à l’archive publique Pyrfume / Leffingwell. `behavior.csv` associe chaque identifiant `Stimulus` à des descripteurs olfactifs codés en `0` ou `1`. `stimuli.csv` permet de relier l’identifiant aux informations sur la molécule. Le jeu d’origine est distribué sous licence CC BY-NC. [Archive Pyrfume](https://github.com/pyrfume/pyrfume-data/tree/main/leffingwell) · [Jeu de données Leffingwell](https://doi.org/10.5281/zenodo.4085098)

**Échantillon exploitable.** [CSV utilisé dans Orange](../DATA/echantillon_leffingwell.csv) avec 10 profils et 113 descripteurs, 10 identifiants uniques et aucune valeur manquante. Seuls 19 descripteurs apparaissent au moins une fois dans cet extrait. Dans le workflow testé, `Stimulus` est une métadonnée. Il sert à identifier les lignes et reste hors du calcul.

**Données à compléter.** Leffingwell fournit des profils de molécules. Une recommandation d’échantillon Givaudan demande aussi un code produit, les applications compatibles et la disponibilité. Pour la démo, on peut utiliser des références fictives clairement identifiées avec ces champs.

## Test et résultat observé

Dans Orange, relier **File → Distances → Distance Matrix**. Dans **File**, placer `Stimulus` en métadonnée. Dans **Distances**, sélectionner **Rows** et **Jaccard**. La matrice compare les 45 paires distinctes de l’échantillon.

| Profil | Identifiant `Stimulus` | Notes présentes |
|---|---|---|
| Ligne 4 · profil de départ | `-873963935677` | `apple`, `fruity`, `green`, `tropical` |
| Ligne 10 · profil le plus proche | `-769823381108` | `apple`, `green` |

**Résultat.** La ligne 10 est la plus proche de la ligne 4 parmi les autres profils de l’extrait. Elles ont deux notes communes sur quatre notes distinctes, ce qui donne une similarité de Jaccard de **2 ÷ 4 = 0,50** et une distance de **1 − 0,50 = 0,50**. Les notes communes sont **pomme** et **verte**.

**Ce que montre le test.** À partir d’un profil de départ, la brique Data sait identifier un profil proche et expliquer le rapprochement avec des descripteurs précis. La distance porte sur les annotations de l’échantillon. La compatibilité avec un support, la qualité de la similarité perçue et la disponibilité d’un échantillon demandent d’autres données ou une validation métier.

## Présentation devant le jury

1. Ouvrir l’échantillon et montrer les colonnes binaires.
2. Dans la matrice Orange, montrer la cellule ligne 4 / colonne 10, qui vaut `0,500`.
3. Expliquer le résultat en une phrase.

> Si un client part du profil de la ligne 4, notre calcul retrouve la ligne 10 comme profil le plus proche dans cet échantillon. On peut expliquer le résultat par les notes pomme et verte qu’ils partagent.
