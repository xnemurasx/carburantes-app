// Servicio de estaciones (vía /api/estaciones)
export async function fetchEstaciones() {
  const r = await fetch("/api/estaciones");
  if (!r.ok) throw new Error("No se pudo obtener estaciones");
  return r.json();
}
