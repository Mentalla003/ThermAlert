//Calcule la pente (en °C/min) de la courbe de température sur une fenêtre de temps glissante.
// Pente (°C/min) par régression linéaire sur la fenêtre glissante.
// points : [{t: timestamp en ms, v: température en °C}, ...]
export function calculerPente(points, fenetreMs, minPoints) {
  const fin = points.length ? points[points.length - 1].t : 0;
  const pts = points.filter(p => fin - p.t <= fenetreMs);
  if (pts.length < minPoints) return null;

  const x = pts.map(p => (p.t - pts[0].t) / 60000); // minutes
  const y = pts.map(p => p.v);
  const n = pts.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (x[i] - mx) * (y[i] - my); den += (x[i] - mx) ** 2; }
  return den === 0 ? null : num / den;
}