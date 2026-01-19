// App para consultar gasolineras cercanas; comentarios breves.

import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { fetchEstaciones } from "./services/carburantes";
import { FUEL_OPTIONS } from "./lib/fuel";
import { haversineKm, normalizeStation, parsePrecio } from "./lib/geo";

// Cabecera
function Header() {
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">App Laboratorio 3</h1>
          <p className="p">
            Geolocaliza, filtra y ordena por distancia/precio.
          </p>
        </div>
        <span className="badge">Vercel-ready</span>
      </div>
    </div>
  );
}

// Componente principal
export default function App() {
  // Coordenadas activas. Por defecto centramos en Madrid para tener resultados iniciales.
  const [coords, setCoords] = useState({ lat: 40.4168, lon: -3.7038 }); // Madrid por defecto
  // Formulario manual de lat/lon para cuando no hay permisos o precisión.
  const [manual, setManual] = useState({ lat: "40.4168", lon: "-3.7038" });

  // Filtros de negocio: carburante, marca (texto libre), radio en km y límite de filas.
  const [fuelId, setFuelId] = useState("g95");
  const [brand, setBrand] = useState("");
  const [radiusKm, setRadiusKm] = useState(10);
  const [limit, setLimit] = useState(20);

  // Estado de UI: spinner, errores y datos crudos de la API.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState(null);

  // Carburante activo (objeto) a partir del id seleccionado.
  const fuel = useMemo(() => FUEL_OPTIONS.find((f) => f.id === fuelId), [fuelId]);

  // Carga remota de estaciones a través del proxy interno. Maneja estados y errores.
  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchEstaciones();
      setRaw(data);
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  // Al montar, disparamos una primera carga para pintar la tabla.
  useEffect(() => {
    load();
  }, []);

  // Geolocalización del navegador; mensajes claros si falla.
  function useMyLocation() {
    setError("");

    if (!navigator.geolocation) {
      setError("Este navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Geolocalización OK:", pos.coords);

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Actualizamos tanto la fuente de verdad (coords) como el formulario manual.
        setCoords({ lat, lon });
        setManual({ lat: String(lat), lon: String(lon) });
      },
      (err) => {
        console.error("Error de geolocalización:", err);

        // Manejo básico de errores de geolocalización.
        if (err.code === 1)
          setError(
            "Permiso denegado. Actívalo en el candado de la URL o usa coordenadas manuales."
          );
        else if (err.code === 2)
          setError(
            "Ubicación no disponible. Activa los servicios de ubicación del sistema o usa coordenadas manuales."
          );
        else if (err.code === 3)
          setError("Timeout obteniendo ubicación. Reintenta o usa coordenadas manuales.");
        else setError("Error desconocido de geolocalización.");
      },
      {
        // Ajustes de geolocalización
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }

  // Valida y aplica coordenadas manuales.
  function applyManual() {
    const lat = Number(String(manual.lat).replace(",", "."));
    const lon = Number(String(manual.lon).replace(",", "."));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setError("Lat/Lon manual no válida.");
      return;
    }
    setError("");
    setCoords({ lat, lon });
  }

  // Deriva estaciones filtradas y ordenadas.
  const stations = useMemo(() => {
    const list = raw?.ListaEESSPrecio ?? raw?.listaEESSPrecio ?? [];
    const normalized = list
      .map(normalizeStation)
      .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lon));

    const withDist = normalized.map((s) => {
      const d = haversineKm(coords.lat, coords.lon, s.lat, s.lon);
      const p = parsePrecio(s.raw, fuel?.key);
      return { ...s, distanceKm: d, price: p };
    });

    const byBrand = brand.trim()
      ? withDist.filter((s) => (s.rotulo || "").toLowerCase().includes(brand.trim().toLowerCase()))
      : withDist;

    const inRadius = Number(radiusKm) > 0 ? byBrand.filter((s) => s.distanceKm <= Number(radiusKm)) : byBrand;

    const filtered = fuel?.key ? inRadius.filter((s) => Number.isFinite(s.price)) : inRadius;

    filtered.sort((a, b) => a.distanceKm - b.distanceKm || (a.price ?? Infinity) - (b.price ?? Infinity));

    return filtered.slice(0, Number(limit));
  }, [raw, coords, fuel, brand, radiusKm, limit]);

  return (
    <div className="container grid" style={{ gap: 16 }}>
      <Header />

      <div className="grid grid-2">
        <div className="card">
          <h2 className="h1" style={{ fontSize: 16 }}>
            Ubicación
          </h2>
          <p className="p">Usa geolocalización o mete coordenadas manuales.</p>

          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={useMyLocation}>
              Usar mi ubicación
            </button>
            <button className="btn secondary" onClick={load} disabled={loading}>
              {loading ? "Cargando..." : "Recargar datos"}
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>Latitud</label>
            <input
              className="input"
              value={manual.lat}
              onChange={(e) => setManual((m) => ({ ...m, lat: e.target.value }))}
            />
            <label>Longitud</label>
            <input
              className="input"
              value={manual.lon}
              onChange={(e) => setManual((m) => ({ ...m, lon: e.target.value }))}
            />

            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn secondary" onClick={applyManual}>
                Aplicar manual
              </button>
              <span className="badge">
                Actual: {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
              </span>
            </div>

            {error ? <div className="err">{error}</div> : null}
          </div>
        </div>

        <div className="card">
          <h2 className="h1" style={{ fontSize: 16 }}>
            Filtros
          </h2>
          <p className="p">Carburante + marca + radio y límite.</p>

          <label>Carburante</label>
          <select className="select" value={fuelId} onChange={(e) => setFuelId(e.target.value)}>
            {FUEL_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>

          <label>Marca (contiene)</label>
          <input
            className="input"
            placeholder="Repsol, Cepsa, BP..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <div className="row" style={{ marginTop: 10 }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label>Radio (km)</label>
              <input
                className="input"
                type="number"
                min="1"
                step="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(e.target.value)}
              />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label>Máx resultados</label>
              <input
                className="input"
                type="number"
                min="5"
                step="5"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <span className="badge">Orden: distancia ↑ (y precio ↑)</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2 className="h1" style={{ fontSize: 16 }}>
              Resultados
            </h2>
            <p className="p">
              Mostrando {stations.length} estaciones (radio {radiusKm} km). Carburante: {fuel?.label}
            </p>
          </div>
        </div>

        <table className="table" style={{ marginTop: 10 }}>
          <thead>
            <tr className="small">
              <th align="left">Estación</th>
              <th align="left">Dirección</th>
              <th align="left">Distancia</th>
              <th align="left">Precio</th>
              <th align="left">Horario</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((s) => (
              <tr key={s.id}>
                <td className="td">
                  <div style={{ fontWeight: 600 }}>{s.rotulo || "—"}</div>
                  <div className="small">
                    {s.municipio} · {s.provincia}
                  </div>
                </td>
                <td className="td">
                  <div>{s.direccion || "—"}</div>
                  <div className="small">CP {s.cp || "—"}</div>
                </td>
                <td className="td">{s.distanceKm.toFixed(2)} km</td>
                <td className="td">{Number.isFinite(s.price) ? `${s.price.toFixed(3)} €` : "—"}</td>
                <td className="td">
                  <div className="small">{s.horario || "—"}</div>
                </td>
              </tr>
            ))}
            {!stations.length && !loading ? (
              <tr>
                <td className="td" colSpan="5">
                  No hay resultados con esos filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
