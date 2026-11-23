//Dessine la courbe de température sur un canvas, avec les zones chaud et froid.
import { CONFIG } from "./config.js";

export function dessinerCourbe(canvas, points) {
  const css = getComputedStyle(document.documentElement);
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const c = canvas.getContext("2d");
  c.scale(dpr, dpr);

  const m = { g: 32, d: 6, h: 6, b: 20 };
  const { AXE_MIN: min, AXE_MAX: max, SEUIL_FROID, SEUIL_CHAUD } = CONFIG;
  const y = t => m.h + (max - t) / (max - min) * (h - m.h - m.b);

  // zones chaud / froid
  c.fillStyle = css.getPropertyValue("--zone-chaud");
  c.fillRect(m.g, y(max), w - m.g - m.d, y(SEUIL_CHAUD) - y(max));
  c.fillStyle = css.getPropertyValue("--zone-froid");
  c.fillRect(m.g, y(SEUIL_FROID), w - m.g - m.d, y(min) - y(SEUIL_FROID));

  // graduations
  c.font = "10px system-ui"; c.fillStyle = "#4a6870"; c.strokeStyle = "#00000022"; c.lineWidth = 1;
  for (let t = min; t <= max; t++) {
    c.beginPath(); c.moveTo(m.g, y(t)); c.lineTo(w - m.d, y(t)); c.stroke();
    c.fillText(t + "°", 4, y(t) + 3);
  }
  if (points.length < 2) return;

  const t0 = points[0].t, t1 = points[points.length - 1].t;
  const x = t => m.g + (t - t0) / Math.max(t1 - t0, 1) * (w - m.g - m.d);

  // courbe
  c.strokeStyle = css.getPropertyValue("--teal"); c.lineWidth = 2; c.lineJoin = "round";
  c.beginPath();
  points.forEach((p, i) => i ? c.lineTo(x(p.t), y(p.v)) : c.moveTo(x(p.t), y(p.v)));
  c.stroke();

  // point courant
  const d = points[points.length - 1];
  c.fillStyle = css.getPropertyValue("--teal");
  c.beginPath(); c.arc(x(d.t), y(d.v), 3.5, 0, 7); c.fill();

  // heures
  c.fillStyle = "#4a6870";
  for (let i = 0; i <= 3; i++) {
    const t = t0 + (t1 - t0) * i / 3;
    const hh = new Date(t).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    c.textAlign = i === 0 ? "left" : i === 3 ? "right" : "center";
    c.fillText(hh, i === 0 ? m.g : i === 3 ? w - m.d : x(t), h - 5);
  }
  c.textAlign = "left";
}