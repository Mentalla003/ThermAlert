
//Gère la communication Bluetooth avec le bracelet (réception de la température, envoi de la vibration) et la simulation du mode démo.
import { CONFIG } from "./config.js";

// Bracelet : Web Bluetooth (Chrome / Edge sur Android et ordinateur, HTTPS ou localhost, geste utilisateur requis)
export class Bracelet {
  constructor() {
    this.onTemperature = () => {};
    this.onEtat = () => {};
    this.vibreur = null;
    this.demo = null;
  }

  static disponible() { return "bluetooth" in navigator; }

  async connecter() {
    const appareil = await navigator.bluetooth.requestDevice({
      filters: [{ services: [CONFIG.SERVICE_UUID] }]
    });
    appareil.addEventListener("gattserverdisconnected", () => this.onEtat(false));
    const serveur = await appareil.gatt.connect();
    const service = await serveur.getPrimaryService(CONFIG.SERVICE_UUID);

    const carTemp = await service.getCharacteristic(CONFIG.TEMP_CHAR_UUID);
    await carTemp.startNotifications();
    carTemp.addEventListener("characteristicvaluechanged", e =>
      this.onTemperature(e.target.value.getInt16(0, true) / 100));

    this.vibreur = await service.getCharacteristic(CONFIG.VIBRATION_CHAR_UUID);
    this.onEtat(true);
  }

  // niveau : 0 = stop, 1 = douce, 2 = moyenne, 3 = forte
  async vibrer(niveau) {
    if (this.vibreur) await this.vibreur.writeValue(Uint8Array.of(niveau));
    else console.info("[démo] vibration niveau", niveau);
  }

  // Simulation sans bracelet : stable ~25 s, puis montée rapide ~30 s, puis stable
  demarrerDemo() {
    let k = 0, v = 36.4;
    this.onEtat(true);
    this.demo = setInterval(() => {
      k++;
      v += (k > 12 && k < 27) ? 0.04 : (Math.random() - 0.5) * 0.01;
      this.onTemperature(Math.round(v * 100) / 100);
    }, 2000);
  }
}