# Carburantes App (React + Vite + Vercel Proxy)

## Ejecutar en local

1) Instala dependencias
```bash
npm install
```

2) Arranca dev server
```bash
npm run dev
```

### Nota importante sobre el proxy en local
En Vercel, `/api/estaciones` funciona automáticamente.
En local (vite), **no** existe ese runtime de serverless.

Opciones rápidas:

**A) Probar en Vercel (recomendado)**
- Sube el repo a GitHub
- Importa en Vercel
- Abre la URL y prueba (proxy funcionando)

**B) Alternativa local:**
- Cambia temporalmente `fetch("/api/estaciones")` por el endpoint real del Gobierno.
  Si tu navegador bloquea por CORS, entonces en local necesitarías un proxy (Node/express o usar `vercel dev`).

## Deploy en Vercel
- Importa el repo
- Framework: Vite
- Build: `npm run build`
- Output: `dist`
