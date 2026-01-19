// Utilidades de geodesia y normalización.

// Convierte "1,234" a 1.234; NaN si no convierte.
export function toFloatES(value) {
  if (value == null) return NaN;
  const s = String(value).trim().replace(",", ".");
  return Number(s);
}

// Distancia aproximada (km) entre dos coordenadas (Haversine).
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

// Homogeneiza campos de una estación y añade lat/lon numéricos.
export function normalizeStation(raw) {
  const lat = toFloatES(raw.Latitud);
  const lon = toFloatES(raw["Longitud (WGS84)"] ?? raw.Longitud);

  return {
    id: `${raw.IDEESS ?? ""}-${raw["C.P."] ?? ""}-${raw.Dirección ?? raw.Direccion ?? ""}`.trim(),
    rotulo: raw.Rótulo ?? raw.Rotulo ?? "",
    direccion: raw.Dirección ?? raw.Direccion ?? "",
    municipio: raw.Municipio ?? "",
    provincia: raw.Provincia ?? "",
    cp: raw["C.P."] ?? "",
    horario: raw.Horario ?? "",
    lat,
    lon,
    raw,
  };
}

// Precio normalizado para la clave indicada; NaN si vacío/0.
export function parsePrecio(raw, key) {
  const v = raw?.[key];
  if (!v || v === "" || v === "0" || v === "0,000") return NaN;
  return toFloatES(v);
}
