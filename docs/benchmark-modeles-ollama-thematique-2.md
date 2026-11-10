# Benchmark des modèles Ollama — Thématique 2

**HETIC Hackathon Givaudan 2026 · Plateforme de commande · 10 novembre 2026**

**Décision pour le prototype.** Nous retenons `qwen3.5:4b` comme premier modèle d’Élia. Les résultats publiés par Qwen soutiennent ce choix pour le suivi des consignes et les tâches multilingues. Notre essai dans Ollama confirme qu’il sait qualifier le cas du savon en français. Le passage à une démonstration intégrée reste conditionné à un appel réussi depuis le Studio et à un temps de réponse acceptable sur le PC de démo.

## 1. Besoin à couvrir

La plateforme distingue deux univers, **Fragrances** et **Arômes alimentaires**. Élia aide le client à décrire son projet avec ses propres mots, repère les informations manquantes, pose une question ciblée et transforme l’échange en brief exploitable. Pour un ancien lancement, Élia aide à identifier la référence de départ et à préciser ce que le client souhaite conserver ou faire évoluer.

Le backend vérifie les références dans le catalogue du bon univers. Il applique les contraintes de compatibilité, puis peut classer les profils proches à partir de leurs descripteurs. Par exemple, la distance de Jaccard testée dans Orange permet de rapprocher deux profils binaires. Le code produit, la disponibilité et l’éligibilité à une demande d’échantillon viennent du catalogue. Cette séparation permet d’évaluer le modèle sur le dialogue et le brief, et le moteur de recherche sur les références proposées.

## 2. Périmètre et critères du comparatif

Le comparatif porte sur cinq modèles téléchargeables dans Ollama, répartis entre trois familles. Le choix privilégie des modèles de taille compatible avec une évaluation sur un poste de hackathon. Les tailles ci-dessous sont celles annoncées dans le catalogue Ollama pour les tags indiqués. La mémoire consommée et la latence dépendent aussi de la machine et des réglages.

| Critère | Résultat attendu pour Élia |
|---|---|
| Compréhension en français | Reformuler le besoin avec les informations fournies et conserver les contraintes exprimées. |
| Suivi des consignes | Poser une seule question quand une information utile manque. Prioriser une donnée qui change les références compatibles. |
| Brief structuré | Produire des champs exploitables par le backend et laisser à confirmer ce que le client n’a pas dit. |
| Fiabilité des références | Se limiter aux références que le backend a fournies ou demander une précision avant la recherche. |
| Exécution locale | Démarrer et répondre sur le PC de démo. Mesurer séparément le premier appel et les appels suivants. |

## 3. Modèles disponibles dans Ollama

| Modèle | Éditeur | Téléchargement annoncé | Intérêt et compromis pour la thématique 2 |
|---|---|---:|---|
| `qwen3.5:2b` | Qwen | 2,7 à 3,1 Go | La variante la plus légère de la sélection. Ses résultats publiés sont inférieurs à ceux du 4B sur les deux indicateurs retenus ci-dessous. Candidat de repli si la latence du 4B pose problème sur le PC de démo. [Catalogue Ollama](https://ollama.com/library/qwen3.5/tags) · [Fiche Qwen 2B](https://huggingface.co/Qwen/Qwen3.5-2B#benchmark-results) |
| **`qwen3.5:4b`** | Qwen | **3,3 à 4,0 Go** | **Choix de prototype.** Format intermédiaire, résultats publiés favorables pour le suivi des consignes et les tâches multilingues, et premier essai de qualification réussi sur le cas savon. [Catalogue Ollama](https://ollama.com/library/qwen3.5/tags) · [Fiche Qwen 4B](https://huggingface.co/Qwen/Qwen3.5-4B#benchmark-results) |
| `qwen3.5:9b` | Qwen | 6,6 à 7,6 Go | Qwen publie de meilleurs résultats généraux que pour le 4B dans la même fiche. Le téléchargement est nettement plus lourd. Le gain sur nos briefs reste à mesurer avant de l’adopter. [Catalogue Ollama](https://ollama.com/library/qwen3.5/tags) · [Comparatif Qwen 4B et 9B](https://huggingface.co/Qwen/Qwen3.5-4B#benchmark-results) |
| `ministral-3:3b` | Mistral AI | 3,0 Go | Alternative compacte d’une autre famille, conçue pour l’exécution locale. Ollama indique la prise en charge des outils pour cette famille. La qualité des questions sur nos cas Givaudan reste à mesurer. [Catalogue Ollama](https://ollama.com/library/ministral-3/tags) · [Fiche Mistral](https://docs.mistral.ai/models/ministral-3-3b-25-12) |
| `gemma3:4b` | Google | 3,4 Go | Alternative de taille proche du modèle retenu. Google publie 90,2 sur IFEval pour Gemma 3 IT 4B. Ce chiffre vient du protocole de Google et ne suffit pas à départager Gemma et Qwen sur nos cas. [Catalogue Ollama](https://ollama.com/library/gemma3%3A4b) · [Fiche Google](https://ai.google.dev/gemma/docs/core/model_card_3#benchmark_results) |

### Résultats publiés pour la famille Qwen3.5

| Variante | IFEval — suivi des consignes | MMMLU — connaissances en plusieurs langues |
|---|---:|---:|
| 2B, mode réflexion | 78,6 | 63,1 |
| **4B** | **89,8** | **76,1** |
| 9B | 91,5 | 81,2 |

Les valeurs proviennent des fiches Qwen. Les résultats 4B et 9B figurent dans le même tableau. Le 2B est repris de sa propre fiche, dans la section avec réflexion. Ce sont des indicateurs généraux publiés par l’éditeur. Ils ne mesurent ni la qualité des questions posées aux clients de Givaudan, ni la vitesse des modèles quantifiés sur notre poste. [Fiche Qwen 2B](https://huggingface.co/Qwen/Qwen3.5-2B#benchmark-results) · [Fiche Qwen 4B et comparaison 9B](https://huggingface.co/Qwen/Qwen3.5-4B#benchmark-results)

## 4. Essai réalisé sur Qwen3.5 4B

**Conditions.** Essai manuel en français dans le terminal Windows avec `ollama run qwen3.5:4b`, en mode réflexion par défaut. La consigne demandait une reformulation en une phrase, une seule question utile et aucune référence inventée. Aucun catalogue produit n’était fourni au modèle pour cet essai.

**Demande client.** « Je cherche une senteur boisée et discrète pour une gamme de savons. »

**Réponse finale observée.**

> Je prends note de votre recherche d'une senteur olfactive boisée et discrète adaptée à votre gamme de savons. Avez-vous un type de bois spécifique en tête (par exemple le santal ou le cèdre) ou préférez-vous orienter vers un accord plus large ?

| Vérification | Résultat observé |
|---|---|
| Langue et reformulation | Réussi. La réponse finale est en français et reprend l’application savon, la famille boisée et l’intensité discrète. |
| Nombre de questions | Réussi. Le modèle pose une seule question. |
| Pertinence de la question | La question affine l’orientation boisée. Si le format ou la base savon détermine la compatibilité, Élia devrait demander cette information en premier. |
| Références produit | Aucune référence inventée sur cet essai. Le santal et le cèdre sont cités comme exemples de notes. |
| Temps de réponse | Non chronométré dans le terminal. Un appel séparé à l’API locale, avec schéma JSON et réflexion désactivée, a expiré après 120 secondes sans réponse exploitable. |
| Intégration au Studio | À valider. L’essai dans le terminal démontre une qualification conversationnelle. Il reste à vérifier la génération du brief par l’API et la recherche dans le catalogue. |

Aucun des autres modèles du tableau n’a été exécuté pour ce comparatif. Le résultat observé permet de retenir Qwen3.5 4B comme candidat de prototype, sans conclure qu’il est le plus rapide ou le plus pertinent des cinq.

## 5. Validation à effectuer avant la démo

Pour comparer deux modèles en conditions réelles, utiliser le même ordinateur, les mêmes messages, le même catalogue de démo et le même format de sortie. Relever la version d’Ollama, le tag et l’identifiant du modèle. Noter si la réflexion est activée ou désactivée. Tester d’abord le 4B dans la configuration prévue pour Élia, puis le 2B si la latence pose problème.

| Cas du brief | Ce qu’on vérifie |
|---|---|
| « Je développe une nouvelle boisson protéinée pour les sportifs. » | Orienter vers les arômes alimentaires. Repérer le format manquant, par exemple prêt à boire ou poudre, et demander une seule précision. |
| « Je cherche une senteur premium pour une nouvelle gamme de savons. » | Orienter vers les fragrances. Préciser le type de base savon ou l’orientation olfactive selon les données disponibles. |
| « Je voudrais retrouver un parfum proche de celui que nous avons lancé il y a trois ans. » | Identifier le lancement à partir de l’historique ou demander un détail pour le retrouver. Faire confirmer la référence de départ avant de proposer des variantes. |

Pour chaque cas, relever la réponse, la validité du brief structuré, le temps de réponse et les références utilisées. Le test est réussi lorsque le Studio exploite les champs retournés, conserve les contraintes du client et affiche uniquement les références autorisées par le backend. Ollama permet de transmettre un schéma JSON dans le champ `format` de l’API. [Documentation Ollama sur les sorties structurées](https://docs.ollama.com/capabilities/structured-outputs)

## Justification à présenter au jury

> Nous avons choisi Qwen3.5 4B pour le prototype d’Élia parce que notre besoin est de qualifier rapidement un brief en français avec un modèle exécutable en local. Dans les résultats publiés par Qwen, le 4B obtient de meilleurs scores que le 2B en suivi des consignes et en multilingue, avec un téléchargement sensiblement plus léger que le 9B. Sur notre premier essai dans Ollama, il a correctement reformulé une demande de senteur boisée et discrète pour un savon, puis posé une seule question utile sans inventer de référence. Le catalogue reste la source des références proposées. La décision finale dépendra du test intégré et du temps de réponse sur le PC de démo.
