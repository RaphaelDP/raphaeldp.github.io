# 🚀 DBT Project Generator

Un générateur automatique de projets **DBT** basé sur **LangGraph** et **Groq**, conçu pour transformer une simple spécification (XLSX/CSV) et une description utilisateur en un projet DBT complet et fonctionnel, prêt à être exécuté dans **Snowflake**.

---

## ✨ Fonctionnalités principales

* 🛠️ **Installation automatisée** : création d’un environnement virtuel et installation des dépendances.
* ⚙️ **Initialisation interactive** : configuration guidée de `.env` et `profiles.yml` avec masquage des secrets.
* 📊 **Ingestion multi-formats** : support des fichiers `xlsx`, `csv`, `txt`, …
* 🤖 **Planification avec LLM (Groq)** : génération de plan DBT en langage naturel.
* 🗂️ **Génération automatique de fichiers DBT** : modèles, tests, `schema.yml`.
* 💾 **Sauvegardes** : backup timestampé des projets générés.
* 🧹 **Nettoyage** : suppression des caches et outputs obsolètes.
* 🔌 **Intégration Snowflake** : configuration complète du compte, user, rôle, warehouse, base et schéma.

---

## 📝 Description

La génération suit les étapes suivantes :

* Ingestion : Lecture et structuration du fichier de spécifications (sources, modèles, relations, descriptions).
* Planification : Génération (ou chargement) d’un plan structuré du projet.
* Préparation : Construction des file specs à partir du plan et du format attendu.
* Génération des fichiers : Création des modèles SQL et des fichiers de configuration (ex: schema.yml).
* Écriture des fichiers : Enregistrement physique du projet dans outputs/.
* Finalisation : Sauvegarde éventuelle du plan/fichiers, logs et backup possible.

Ces étapes sont orchestrées via LangGraph, avec des nœuds spécialisés (ingestion, plan, génération de fichiers, sauvegarde, etc.) et des edges de décision pour charger ou régénérer les objets.

---

## 📦 Installation

### 1. Cloner le dépôt / se procurer le projet

```bash
git clone {ref}/DataPipeline_IA.git
cd DataPipeline_IA
```

### 2. Installer les dépendances

```bash
python main.py install
```

Cela crée un environnement virtuel `venv/` et l'active, puis installe tout depuis `requirements.txt`.

Pour activer l'environnement virtuel ensuite, vous devrez faire :

```bash
& ./.venv/Scripts/Activate.ps1
```

Ceci est nécessaire à chaque utilisation. Si vous avez besoin de le désactiver, il vous suffit de faire :

```bash
deactivate
```

---

## ⚙️ Initialisation de l’environnement

Lancer la configuration interactive :

```bash
python main.py init
```

Vous serez guidé pour compléter :

* `.env` (clés API, Snowflake, Groq, …)
* `profiles.yml` (profil DBT)

Les champs sensibles sont masqués.

---

## 🔑 Configuration requise

### Snowflake

Lors de l’initialisation, vous devrez fournir les informations suivantes :

* **account** → `xy12345.eu-central-1`
* **user** → `dbt_user`
* **password** → `********`
* **role** → `SYSADMIN`
* **warehouse** → `COMPUTE_WH`
* **database** → `ANALYTICS_DB`
* **schema** → `PUBLIC`

### Groq

Obtenez une clé API sur 👉 [https://console.groq.com/](https://console.groq.com/)
Ajoutez-la dans `.env` :

```env
GROQ_API_KEY=sk-xxxxxx
```

ℹ️ Voir les [rate limits](https://console.groq.com/docs/rate-limits).

---

## ▶️ Utilisation

### Générer un projet DBT

```bash
python main.py run
```

Vous serez invité à fournir :

* Nom du projet
* Base output path
* Profil DBT à utiliser (attention il doit déjà être créé via l'initialisation)
* Fichier de spécification (`xlsx` ou `csv`)

Le projet sera généré dans `outputs/`.

### Sauvegarder un projet

```bash
python main.py backup <project_name>
```

### Nettoyer l’environnement

```bash
python main.py clean
```

### Interface Streamlit (User-Friendly)

Une interface web interactive est disponible pour lancer la génération et suivre les logs en temps réel :

```
streamlit run app.py
```

Ceci ouvre une interface graphique dans le navigateur, où vous pouvez :

* Fournir la description utilisateur et le fichier de spécification.
* Lancer la génération DBT avec suivi visuel.
* Accéder au chemin du projet généré directement.

---



## 📚 Architecture du projet

```bash
C:.
│   .env                          # Variables d’environnement (Snowflake, clés API…)
│   .venv                         # Environnement virtuel Python
│   .gitignore                    # Fichiers/dossiers ignorés par Git
│   .pylintrc                     # Configuration de linting
│   app.py                        # Application Streamlit pour exécuter le générateur en interface graphique
│   main.py                       # CLI principale pour lancer les différentes tasks
│   README.md                     # Documentation du projet
│   requirements.txt              # Dépendances Python
│   test_chef_orchestre.ipynb     # Notebook de test (prototype orchestration)
│   test_chef_orchestre2.ipynb    # Autre notebook de test
│
├───backups                       # Sauvegardes horodatées des projets générés
│
├───config
│   │   css_variables.py          # Variables CSS pour styliser l’interface Streamlit
│   │   variables.py              # Variables globales du projet (chemins, constantes…)
│
├───docs
│   │   doc.md                    # Documentation technique en Markdown
│   │   Documentation.docx        # Documentation Word
│   │   exemple_specs.png         # Exemple de fichier de spécifications
│   │   graphViz.drawio.png       # Diagramme de graphe (visuel LangGraph)
│   │   Orchestrenom.drawio.png   # Diagramme d’orchestration
│   │   test.drawio.png           # Autre schéma de test
│
├───formats
│   │   expected_format.json      # Format attendu pour le plan/fichiers générés
│   │
│   └───prompts
│           prompt_file_model.txt # Prompt LLM pour générer un modèle SQL
│           prompt_file_test.txt  # Prompt LLM pour générer des tests
│           prompt_plan.txt       # Prompt LLM pour générer un plan
│
├───inputs                        # Fichiers d’entrée utilisés pour générer les projets
│       a_peaks.tsv
│       routes.csv
│       saved_files.json          # Fichiers déjà générés (chargement possible)
│       saved_plan.json           # Plan sauvegardé (chargement possible)
│       spec_members.txt
│       Tableau_Spec.xlsx         # Exemple de spécification DBT
│       Test_Spécification_Jaffle_shop.xlsx
│
├───outputs                       # Projets DBT générés automatiquement
│
└───src
    ├───core
    │   │   generate_dbt_project.py   # Fonction principale pour exécuter une génération complète
    │   │   llm.py                    # Interface pour appeler le LLM (Groq API)
    │   │   plan_fct.py               # Fonctions liées au plan (sauvegarde/chargement…)
    │   │   snowflake_fct.py          # Fonctions utilitaires pour Snowflake
    │   │   write_files.py            # Écriture physique des fichiers DBT générés
    │   │
    │   └───tasks
    │           task_backup.py        # Task CLI : sauvegarde d’un projet
    │           task_clean.py         # Task CLI : nettoyage des outputs/__pycache__
    │           task_init_env.py      # Task CLI : initialisation de l’environnement (config + .env)
    │           task_install.py       # Task CLI : installation venv + requirements
    │           task_run.py           # Task CLI : exécution du pipeline en mode console
    │
    ├───graph
    │   │   build_graph.py            # Construction du graphe LangGraph
    │   │   state.py                  # Définition du State partagé (TypedDict)
    │   │
    │   ├───edges
    │   │       edge_select_files.py  # Edge : choisir/charger fichiers existants
    │   │       edge_select_plan.py   # Edge : choisir/charger plan existant
    │   │       edge_verify_plan.py   # Edge : vérifier validité du plan
    │   │
    │   └───nodes
    │           node_create_file.py                   # Génération physique d’un fichier
    │           node_end_process.py                   # Fin normale du process
    │           node_end_process_bad_plan_generation.py# Fin anticipée si plan invalide
    │           node_generate_file.py                 # Génération logique de fichiers
    │           node_generate_plan.py                 # Génération du plan via LLM
    │           node_generate_source_yaml.py          # Génération automatique du schema.yml
    │           node_ingestion.py                     # Ingestion des fichiers d’entrée
    │           node_init_project.py                  # Initialisation du projet DBT
    │           node_load_files.py                    # Chargement de fichiers sauvegardés
    │           node_load_plan.py                     # Chargement du plan sauvegardé
    │           node_prepare_file_specs.py            # Préparation des file specs
    │           node_save_outputs.py                  # Sauvegarde des outputs finaux
    │
    ├───test
    │       test_generer_exemple.py   # Tests unitaires/exemple de génération
    │
    └───utils
            graph_tracker.py          # Suivi du graphe pendant l’exécution
            logging_buffer.py         # Logger mémoire pour affichage en temps réel
            utils.py                  # Fonctions utilitaires diverses

```

---

## 🛠️ Dépendances principales

* [Python 3.10+](https://www.python.org/)
* [dbt-core](https://docs.getdbt.com/)
* [Snowflake](https://www.snowflake.com/)
* [LangGraph](https://python.langchain.com/docs/langgraph/)
* [Groq](https://groq.com/)

---

## 🧑‍💻 Contributeurs

* Auteurs principaux : Raphael DIEZ PECOSTE , Julien PAPINI
* Contributions bienvenues via issues & PR.

---
