//Paramètres réglables du projet : identifiants Bluetooth du bracelet, seuil d'alerte sur la pente et échelle de la courbe.
// Paramètres centralisés : à ajuster après les premiers tests avec le bracelet.
export const CONFIG = {
  // UUID GATT personnalisés : à reprendre à l'identique dans le code MicroPython
  SERVICE_UUID: "12345678-1234-5678-1234-56789abcdef0",
  TEMP_CHAR_UUID: "12345678-1234-5678-1234-56789abcdef1",  // notify : int16 little-endian, en centièmes de °C
  VIBRATION_CHAR_UUID: "12345678-1234-5678-1234-56789abcdef2", // write : 1 octet (0 = stop, 1 douce, 2 moyenne, 3 forte)

  FENETRE_PENTE_MS: 5 * 60 * 1000, // la pente est calculée sur les 5 dernières minutes
  MIN_POINTS_PENTE: 6,             // nombre minimal de mesures avant de calculer une pente
  SEUIL_PENTE: 0.10,               // °C/min (valeur absolue) au-delà de laquelle on alerte
  DELAI_ENTRE_ALERTES_MS: 60 * 1000,
  MAX_POINTS: 360,                 // taille max de l'historique conservé

  AXE_MIN: 35, AXE_MAX: 39,        // échelle de la courbe
  SEUIL_FROID: 36, SEUIL_CHAUD: 38 // zones colorées de la courbe
};