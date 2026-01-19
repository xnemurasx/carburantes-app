# Aplicación web de consulta de precios de carburantes

Este proyecto consiste en una aplicación web desarrollada con React que permite consultar información sobre las estaciones de servicio en España a partir de los datos públicos ofrecidos por el Ministerio para la Transformación Digital y Función Pública.

La aplicación obtiene los datos a través de la API REST oficial de precios de carburantes y los procesa para mostrar al usuario las estaciones más cercanas a una ubicación determinada, así como permitir distintos filtros sobre los resultados.

## Funcionalidad principal

La aplicación ofrece las siguientes funcionalidades:

- Obtención de la ubicación del usuario mediante geolocalización del navegador.
- Introducción manual de coordenadas (latitud y longitud) como alternativa a la geolocalización automática.
- Consulta de estaciones de servicio cercanas a la ubicación indicada.
- Cálculo de la distancia entre el usuario y cada estación mediante fórmula Haversine.
- Filtrado por tipo de carburante.
- Filtrado por marca de estación.
- Limitación de resultados por radio de kilómetros y número máximo de estaciones.
- Ordenación de resultados por distancia y precio.
- Visualización formateada de los resultados (dirección, distancia, precio y horario).

## Tecnologías utilizadas

- **React** con **Vite** para el desarrollo de la interfaz basada en componentes.
- **JavaScript (ES6+)**.
- **HTML5 y CSS3** con un diseño minimalista y responsivo.
- **API REST de precios de carburantes** del Gobierno de España.
- **Funciones serverless en Vercel** como proxy para evitar problemas de CORS y centralizar el acceso a la API.

## Arquitectura de la aplicación

La aplicación se ha diseñado siguiendo una arquitectura sencilla de frontend desacoplado:

- El cliente React se encarga de la interfaz, la interacción con el usuario y el procesamiento de datos (cálculo de distancias, filtros y ordenaciones).
- El acceso a la API externa se realiza a través de un endpoint serverless que actúa como intermediario, evitando restricciones de CORS y permitiendo una futura ampliación (caché, validaciones, etc.).

## Geolocalización

La obtención de la ubicación se realiza mediante la API de Geolocation del navegador.  
En caso de que el usuario no conceda permisos o el navegador no pueda determinar la posición, la aplicación permite introducir manualmente las coordenadas, garantizando el funcionamiento completo de la aplicación en cualquier entorno.

## Despliegue

El proyecto está alojado en un repositorio de GitHub y desplegado en la plataforma Vercel, lo que permite:

- Despliegue automático a partir del repositorio.
- Uso de funciones serverless para el proxy de la API.
- Acceso a la aplicación desde cualquier navegador sin necesidad de instalación.

## Ejecución en local

Para ejecutar la aplicación en local:

```bash
npm install
npm run dev

