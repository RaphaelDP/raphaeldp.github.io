# Débruitage d'images par ACP (Analyse en Composantes Principales)

**Projet** : Débruitage d’images par Analyse en Composantes Principales (PCA / ACP)
**Langage** : Java (JavaFX pour l’UI)
**Libs** : Apache Commons Math 3.6.1 (calcul matriciel), JDK 11+ / 17+ compatible
**Structure** : `core` (algorithme), `gui` (JavaFX), `main` (entrée), `data` (images), `lib` (jars)

---

## Contexte & objectif

Ce projet implémente une méthode de restauration d’images basée sur l’Analyse en Composantes Principales (ACP). Le principe :

1. Découper l’image en petits _patchs_ (s × s).
2. Aplatir chaque patch en vecteur et former une matrice de données (N × p).
3. Centrer les données et calculer la matrice de covariance.
4. Extraire vecteurs propres / valeurs propres (ACP) — tri décroissant.
5. Projeter les patches sur les composantes principales, appliquer un seuillage (dur / doux).
6. Reconstruire les patches depuis les composantes retenues et recomposer l’image.
7. Mesurer la qualité (PSNR, MSE) et afficher les métriques.

L’approche est pédagogique et expérimentale : tests sur différentes tailles de patchs, critères de seuillage (VisuShrink, BayesShrink) et nombre de composantes.

---

## Arborescence

```
debruitage-par-ACP/
├─ data/                     # images d'exemple (lena.jpg, lion.jpg, ...)
├─ lib/                      # jars (commons-math3, javafx jars)
├─ makefile                  # compilation et exécution
├─ MANIFEST.MF
└─ src/
   ├─ core/
   │   ├─ Critere.java
   │   ├─ Image.java
   │   ├─ ImageTest.java
   │   ├─ OutilsMathematiques.java
   │   ├─ PatchCollection.java
   │   └─ Patch.java
   ├─ gui/
   │   ├─ Accueil.java
   │   ├─ Appli.java
   │   ├─ ChoixImage.java
   │   ├─ ChoixParametres.java
   │   └─ Resultat.java
   └─ main/
       ├─ Console.java
       └─ Main.java
```

---

## Installation & compilation

### Prérequis

- JDK 11+ (idéalement 17)
- JavaFX (jar fournis dans `lib/`)
- Apache Commons Math 3.6.1
- Make (optionnel)

### Compilation via Makefile

```bash
make
# ou
make build
```

### Compilation manuelle

```bash
mkdir -p out
javac -d out -cp "lib/*" $(find src -name "*.java")
jar cfm debruitage.jar MANIFEST.MF -C out .
```

---

## Exécution

### Mode GUI

```bash
java -jar debruitage.jar
# ou
java -cp "lib/*:out:." main.Main
```

### Mode console

```bash
java -cp "lib/*:out:." main.Console --input data/lena.jpg --patch 7 --k 20 --sigma 20 --mode seuillageDur --out outputs/lena_denoised.jpg
```

---

## Description technique par module

### `core/Image.java`

- Lecture/écriture d’images, conversion RGB → gris.
- Ajout de bruit, découpage en patchs, reconstruction.
- Fonctions de débruitage global/local.

### `core/Patch.java`

- Représentation d’un patch d’image.
- Fonctions de seuillage dur/doux sur les coefficients projetés.

### `core/PatchCollection.java`

- Gestion d’ensembles de patchs.
- Calcul de moyenne, covariance, reconstruction avec recouvrement.

### `core/OutilsMathematiques.java`

- Fonctions de calcul ACP (covariance, décomposition propre, projection).
- Utilise Apache Commons Math.

### `core/Critere.java`

- Calcul des seuils adaptatifs (VisuShrink, BayesShrink).

### `gui/*`

- Interface graphique JavaFX : chargement d’image, choix des paramètres, affichage résultats.

### `main/Main.java` et `Console.java`

- Points d’entrée : GUI et mode console.

---

## Formats, métriques & validation

- **Entrée** : JPG/PNG (converti en N&B)
- **Sortie** : image débruitée (même format)
- **Métriques** : PSNR, MSE, variance expliquée
- **Tests** : `ImageTest.java` valide reconstruction et gain PSNR

---

## Utilisation du Makefile

Le `makefile` automatise la compilation, l’exécution et le nettoyage du projet. Il gère à la fois le lancement de l’interface graphique (JavaFX) et le mode console.
Les dépendances principales (JavaFX, Apache Commons Math) doivent être présentes dans le dossier `lib/`.

### Commandes disponibles

```bash
# Compile toutes les classes Java et crée les fichiers .class dans le dossier bin/
make build

# Lance l’application JavaFX principale (interface graphique)
make run

# Lance la version console (sans interface graphique)
make console

# Nettoie tous les fichiers compilés (.class) dans bin/
make clean

# Recompile entièrement le projet après nettoyage
make rebuild

# Affiche l’aide listant toutes les commandes disponibles
make help
```

### Exemple de structure possible du Makefile

```makefile
SRC = src
BIN = bin
LIB = lib/*

build:
	@echo "Compilation du projet..."
	@javac -cp $(LIB) -d $(BIN) $(SRC)/**/*.java

run:
	@echo "Lancement de l’application graphique..."
	@java -cp $(BIN):$(LIB) main.Main

console:
	@echo "Lancement de la version console..."
	@java -cp $(BIN):$(LIB) main.Console

clean:
	@echo "Nettoyage des fichiers compilés..."
	@rm -rf $(BIN)/*

rebuild: clean build

help:
	@echo "Commandes disponibles :"
	@echo "  make build   -> Compile le projet"
	@echo "  make run     -> Lance l’interface graphique"
	@echo "  make console -> Lance le mode console"
	@echo "  make clean   -> Supprime les fichiers compilés"
	@echo "  make rebuild -> Nettoie puis recompile"
	@echo "  make help    -> Affiche cette aide"
```

---

## Limitations & pistes d'amélioration

- Gourmand en mémoire pour grandes images (matrice N×p)
- Décomposition propre coûteuse (EigenDecomposition)
- Pas encore parallélisé

**Améliorations possibles :**

- ACP tronquée / SVD partielle
- Parallélisation via `ExecutorService`
- Packaging Maven/Gradle + CI
- Logging unifié (SLF4J)

---

## Exemple d'exécution (pseudo)

```bash
java -cp "lib/*:out:." main.Console --input data/lena.jpg --patch 7 --k 20 --sigma 20 --mode seuillageDoux --out result/lena_denoised.jpg
```

---

## Licence

Projet distribué sous licence **MIT**. Vous êtes libre d’utiliser, modifier et redistribuer le code, à condition de conserver la mention du ou des auteurs originaux et la présente licence.

---

## Contact

Auteur / Mainteneur : Raphael DIEZ PECOSTE
Contact : [[ton.email@domaine.com](mailto:ton.email@domaine.com)]

---
