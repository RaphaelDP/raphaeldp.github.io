/**
 * Render a collapsible file tree into a container.
 * @param {string} containerId - ID of the container element
 * @param {object} treeData - JSON object describing the tree
 */
function renderFileTree(containerId, treeData) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`[file_tree] container #${containerId} introuvable`);
    return;
  }
  container.innerHTML = "";
  const tree = buildTree(treeData);
  container.appendChild(tree);
}

/**
 * Build the tree recursively.
 * Accepts two file formats:
 * - null (file with no description)
 * - { description: "..." } (file with description)
 */
function buildTree(tree) {
  const ul = document.createElement("ul");
  ul.className = "file-tree";

  Object.keys(tree).forEach((name) => {
    const li = document.createElement("li");
    const value = tree[name];
    const isObject = value && typeof value === "object";
    const isFileWithDesc = isObject && "description" in value;
    const isFolder = isObject && !isFileWithDesc;

    if (isFolder) {
      li.className = "tree-item tree-folder";

      const toggle = document.createElement("span");
      toggle.className = "tree-toggle";
      toggle.textContent = name;
      toggle.setAttribute("role", "button");
      toggle.addEventListener("click", () => {
        li.classList.toggle("tree-open");
      });
      li.appendChild(toggle);

      const children = buildTree(value);
      children.className = "tree-children";
      li.appendChild(children);
    } else {
      li.className = "tree-item tree-file";

      const fileSpan = document.createElement("span");
      fileSpan.textContent = name;
      fileSpan.className = "tree-file-name";
      fileSpan.style.cursor = "pointer";
      li.appendChild(fileSpan);

      const description =
        isFileWithDesc ? (value.description || "Pas de description disponible.") :
        "Pas de description disponible.";

      fileSpan.addEventListener("click", (e) => {
        console.log("clic sur", name); // debug
        showFileDescription(name, description, e);
      });
    }

    ul.appendChild(li);
  });

  return ul;
}

// Variables globales pour repositionnement
let currentBubble = null;
let currentAnchor = null;

function showFileDescription(filename, description, event) {
  // Supprimer une bulle existante
  if (currentBubble) {
    currentBubble.remove();
    currentBubble = null;
    currentAnchor = null;
    window.removeEventListener("resize", positionBubble);
  }

  const bubble = document.createElement("div");
  bubble.className = "file-bubble";
  bubble.innerHTML = `<strong>${escapeHtml(filename)}</strong><br>${escapeHtml(description)}`;

  document.body.appendChild(bubble);

  // Sauvegarder références
  currentBubble = bubble;
  currentAnchor = event.currentTarget;

  // Positionner immédiatement
  positionBubble();

  // Fermer la bulle si clic ailleurs
  const closeBubble = (e) => {
    if (!bubble.contains(e.target) && e.target !== currentAnchor) {
      bubble.remove();
      currentBubble = null;
      currentAnchor = null;
      document.removeEventListener("click", closeBubble);
      document.removeEventListener("keydown", escClose);
      window.removeEventListener("resize", positionBubble);
    }
  };
  setTimeout(() => { // éviter auto-fermeture immédiate
    document.addEventListener("click", closeBubble);
  }, 0);

  // Fermer avec Échap
  const escClose = (e) => {
    if (e.key === "Escape") {
      bubble.remove();
      currentBubble = null;
      currentAnchor = null;
      document.removeEventListener("click", closeBubble);
      document.removeEventListener("keydown", escClose);
      window.removeEventListener("resize", positionBubble);
    }
  };
  document.addEventListener("keydown", escClose);

  // Repositionner au resize
  window.addEventListener("resize", positionBubble);
}

function positionBubble() {
  if (!currentBubble || !currentAnchor) return;

  const rect = currentAnchor.getBoundingClientRect();
  const bubbleRect = currentBubble.getBoundingClientRect();

  // Centrer verticalement : milieu du fichier - moitié de la bulle
  const top = rect.top + window.scrollY + (rect.height / 2) - (bubbleRect.height / 2);
  const left = rect.right + window.scrollX + 12; // décalage à droite

  currentBubble.style.top = `${top}px`;
  currentBubble.style.left = `${left}px`;
}
/**
 * Convertit les \n en <br> pour l'affichage HTML
 */
function formatDescription(str) {
  return escapeHtml(str).replace(/\n/g, "<br>");
}



/**
 * Minimal HTML escape to prevent accidental HTML injection in descriptions.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
