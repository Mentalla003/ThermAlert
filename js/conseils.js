// Tableau des conseils : ajoutez-en autant que vous voulez.
export const CONSEILS = [
  { icone: "💧", titre: "Pensez à vous hydrater", texte: "Buvez régulièrement, même sans soif." },
  { icone: "☀️", titre: "Évitez les efforts entre 12h et 18h", texte: "Privilégiez le matin tôt ou la fin de la soirée." },
  { icone: "🧥", titre: "Couvrez-vous par temps froid", texte: "Superposez plusieurs couches, protégez mains et tête." },
  { icone: "🏠", titre: "Rafraîchissez-vous", texte: "Restez à l'ombre ou dans une pièce fraîche en cas de forte chaleur." },
  { icone: "🍲", titre: "Mangez suffisamment", texte: "Un repas chaud aide le corps à maintenir sa température." },
  { icone: "🚶", titre: "Faites des pauses", texte: "Arrêtez-vous dès que vous vous sentez étourdi ou très fatigué." },
  { icone: "👕", titre: "Choisissez des vêtements adaptés", texte: "Légers et clairs l'été, chauds et coupe-vent l'hiver." },
  { icone: "📞", titre: "Un doute ? Demandez de l'aide", texte: "En cas de malaise, appelez le 15 ou le 112." }
];

// Tire n conseils différents au hasard (mélange de Fisher-Yates)
export function tirerConseils(n = 2) {
  const t = [...CONSEILS];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t.slice(0, n);
}