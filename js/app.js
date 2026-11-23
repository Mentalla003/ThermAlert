// Point d'entrée : gère les onglets, affiche les mesures, détecte les variations de pente et déclenche l'alerte du vibreur.
import { CONFIG } from "./config.js";
import { Bracelet } from "./ble.js";
import { calculerPente } from "./analyse.js";
import { dessinerCourbe } from "./courbe.js";
import { tirerConseils } from "./conseils.js";

const $ = id => document.getElementById(id);
const bracelet = new Bracelet();
const historique = [];
let derniereAlerte = 0;

/* ---------- Navigation par onglets (une seule page => la connexion Bluetooth reste active) ---------- */
function router() {
  const id = (location.hash || "#accueil").slice(1);
  document.querySelectorAll(".vue").forEach(v => (v.hidden = v.id !== id));
  document.querySelectorAll(".onglet").forEach(a =>
    a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + id));
  document.querySelectorAll(".onglet[aria-current]").forEach(a => a.setAttribute("aria-current", "page"));
  if (id === "accueil") dessinerCourbe($("courbe"), historique);
}
window.addEventListener("hashchange", router);
window.addEventListener("resize", () => dessinerCourbe($("courbe"), historique));

/* ---------- Conseils aléatoires, tirés à chaque chargement de la page ---------- */
$("conseils").innerHTML = tirerConseils(2).map(c => `
  <article class="conseil">
    <span class="conseil__icone" aria-hidden="true">${c.icone}</span>
    <div><h3 class="conseil__titre">${c.titre}</h3><p class="conseil__texte">${c.texte}</p></div>
  </article>`).join("");

/* ---------- Réception des mesures ---------- */
function niveauVibration() {
  return Number(localStorage.getItem("vibration")) || 2; // réglé plus tard dans l'onglet Profil
}

function afficher(pente, enAlerte) {
  const derniere = historique[historique.length - 1].v;
  $("temp-valeur").textContent = derniere.toFixed(1).replace(".", ",") + "°C";
  const badge = $("badge");
  badge.className = "badge " + (enAlerte ? "alerte" : pente === null ? "" : "stable");
  badge.textContent = enAlerte ? "Variation rapide" : pente === null ? "Mesure…" : "Stable";
  $("pente-texte").textContent = pente === null
    ? "Pente : -- °C/min"
    : `Pente : ${pente > 0 ? "+" : ""}${pente.toFixed(2).replace(".", ",")} °C/min`;
  dessinerCourbe($("courbe"), historique);
}

bracelet.onTemperature = valeur => {
  historique.push({ t: Date.now(), v: valeur });
  if (historique.length > CONFIG.MAX_POINTS) historique.shift();

  const pente = calculerPente(historique, CONFIG.FENETRE_PENTE_MS, CONFIG.MIN_POINTS_PENTE);
  const enAlerte = pente !== null && Math.abs(pente) >= CONFIG.SEUIL_PENTE;

  if (enAlerte && Date.now() - derniereAlerte > CONFIG.DELAI_ENTRE_ALERTES_MS) {
    derniereAlerte = Date.now();
    bracelet.vibrer(niveauVibration()).catch(console.error);
  }
  afficher(pente, enAlerte);
};

/* ---------- Mode démo : aucun bracelet, aucune connexion Bluetooth ---------- */
$("statut").classList.add("connecte");

// Historique simulé des 2 dernières heures pour que la courbe soit déjà remplie
const maintenant = Date.now();
for (let i = 60; i > 0; i--) {
  historique.push({
    t: maintenant - i * 2 * 60000,
    v: 36.4 + Math.sin(i / 6) * 0.15 + (Math.random() - 0.5) * 0.05
  });
}

bracelet.demarrerDemo(); // puis une nouvelle mesure toutes les 2 s
router();