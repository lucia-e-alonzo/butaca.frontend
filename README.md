# BUTACA - Frontend

## Estructura del repositorio

butaca/
│
├── frontend/
│   ├── public/
│   │   └── models/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── movies/
│   │   │   └── dashboard/
│   │   │
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── Home/
│   │   │   ├── Recommendations/
│   │   │   ├── Favorites/
│   │   │   └── Dashboard/
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── emotion.js
│   │   │   └── favorites.js
│   │   │
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   └── ...
│
├── README.md
└── .gitignore

## Configruacion de GitHub

main
  │
  └── develop
        │
        ├── feature/history-camera-dashboard (LUCIA)
        ├── feature/global-styles (LUCIA)
        ├── feature/auth-navigation (SOFIA)
        ├── feature/movies-favorites (SOFIA)

# Butaca – División de tareas del Frontend

## 1. Organización del equipo

El desarrollo del frontend de Butaca se dividirá entre dos integrantes. Cada uno tendrá responsabilidades específicas sobre determinadas funcionalidades, páginas y componentes.

El objetivo es distribuir el trabajo de manera equilibrada, evitar conflictos al trabajar simultáneamente y mantener una estructura consistente en todo el proyecto.

### División general

| Integrante | Área principal | Responsabilidades |
|---|---|---|
| Integrante 1 | Experiencia personalizada y diseño | Historial de emociones, permisos de cámara, detección de emociones, dashboard y estilos globales. |
| Integrante 2 | Acceso, navegación y películas | Autenticación, navegación, catálogo, tendencias, favoritos y recomendaciones. |

---

## 2. Organización de branches

Se utilizará `develop` como rama principal de integración. Cada integrante trabajará en ramas `feature` independientes, creadas directamente desde `develop`.

### Integrante 1 - LUCÍA

| Branch | Responsabilidad |
|---|---|
| `feature/history-camera-dashboard` | Historial de emociones, cámara, detección de emociones y dashboard. |
| `feature/global-styles` | Diseño visual, estilos globales y componentes reutilizables de interfaz. |

### Integrante 2 - SOFÍA

| Branch | Responsabilidad |
|---|---|
| `feature/auth-navigation` | Inicio de sesión, autenticación y navegación. |
| `feature/movies-favorites` | Catálogo, tendencias, favoritos y recomendaciones. |

### Reglas de trabajo con Git

- Todas las ramas `feature` deben crearse directamente desde `develop`.
- Cada integrante debe trabajar únicamente en las ramas correspondientes a sus responsabilidades.
- Los cambios terminados se integrarán en `develop`.
- Antes de comenzar una nueva tarea, se debe actualizar la rama de trabajo con los cambios recientes de `develop`.
- No se deben modificar archivos asignados al otro integrante sin coordinación previa.
- Los archivos compartidos deben modificarse de manera coordinada para evitar conflictos.
- No se debe trabajar directamente sobre `main` o `develop` para desarrollar funcionalidades.

---

# 3. Responsabilidades del Integrante 1

## Área: Experiencia personalizada, historial y diseño

Responsable de desarrollar las funcionalidades relacionadas con el análisis de emociones del usuario, el historial de actividad, el dashboard y la apariencia visual general de Butaca.

### 3.1. Historial de emociones y películas recomendadas

**Branch:** `feature/history-camera-dashboard`

El historial mostrará la actividad emocional del usuario a lo largo del año, utilizando una cuadrícula inspirada en el mapa de contribuciones de GitHub.

#### Funcionalidades

1. Crear una página de historial.
2. Mostrar una cuadrícula con los días del año.
3. Representar cada día mediante un cuadro que cambiará de color dependiendo de la primera emoción detectada ese día.
4. Dejar sin color los días en los que no existan registros.
5. Permitir seleccionar un día de la cuadrícula.
6. Mostrar las emociones detectadas durante ese día.
7. Mostrar las películas recomendadas para cada emoción detectada.
8. Diferenciar visualmente las distintas emociones mediante una paleta de colores.
9. Manejar los estados de carga, error y ausencia de registros.
10. Permitir consultar los registros de años anteriores, si el backend lo permite.

#### Reglas de funcionamiento

- Cada cuadro representa un día del año.
- Si existe más de una emoción registrada en un día, el cuadro utilizará el color de la primera emoción detectada cronológicamente.
- Al seleccionar un día, se mostrarán todas las emociones detectadas durante ese día y las películas recomendadas asociadas a cada una.
- Los registros deben obtenerse del backend, no depender únicamente del almacenamiento local del navegador.

#### Archivos propuestos

```text
src/
├── pages/
│   └── History/
│       ├── History.jsx
│       └── History.css
├── components/
│   └── history/
│       ├── EmotionCalendar.jsx
│       ├── EmotionDay.jsx
│       ├── EmotionDayDetails.jsx
│       └── EmotionLegend.jsx
└── services/
    └── historyService.js
```

### 3.2. Solicitud de permisos y manejo de cámara

**Branch:** `feature/history-camera-dashboard`

Implementar el acceso a la cámara del dispositivo mediante los permisos proporcionados por el navegador.

#### Funcionalidades

1. Solicitar permiso para utilizar la cámara.
2. Informar al usuario por qué se necesita acceder a la cámara.
3. Encender la cámara únicamente cuando el usuario lo solicite.
4. Mostrar el video de la cámara en la interfaz.
5. Manejar el rechazo del permiso.
6. Manejar la ausencia de una cámara disponible.
7. Mostrar los estados de cámara activa, inactiva y error.
8. Detener la cámara al finalizar el proceso o abandonar la funcionalidad.
9. Evitar que la cámara permanezca activa innecesariamente.

#### Archivos propuestos

```text
src/
├── components/
│   └── camera/
│       ├── CameraPermission.jsx
│       ├── CameraView.jsx
│       └── CameraStatus.jsx
└── hooks/
    └── useCamera.js
```

### 3.3. Detección de emociones

**Branch:** `feature/history-camera-dashboard`

Implementar la detección de emociones utilizando Face-api.js mediante procesamiento local en el navegador.

#### Funcionalidades

1. Cargar los modelos necesarios de Face-api.js.
2. Detectar rostros mediante la cámara.
3. Identificar las emociones disponibles en el modelo.
4. Obtener los niveles de confianza de las detecciones.
5. Mostrar el resultado de la detección en la interfaz.
6. Manejar errores durante la carga de modelos.
7. Controlar la frecuencia de detección para evitar procesos innecesarios.
8. Enviar al backend únicamente los resultados de la detección que sean necesarios.
9. Detener el procesamiento cuando la cámara se apague.

#### Consideraciones de privacidad

- La detección se realizará localmente en el navegador.
- No se debe enviar ni almacenar la imagen de la cámara en el backend.
- Únicamente se enviarán los resultados necesarios, como la emoción, el nivel de confianza y los datos asociados a la recomendación.
- El acceso a la cámara debe depender del consentimiento del usuario.

#### Archivos propuestos

```text
src/
├── components/
│   └── camera/
│       ├── EmotionResult.jsx
│       └── EmotionIndicator.jsx
├── hooks/
│   └── useEmotionDetection.js
├── services/
│   └── emotionService.js
└── utils/
    └── emotionUtils.js

public/
└── models/
```

### 3.4. Dashboard

**Branch:** `feature/history-camera-dashboard`

Crear el dashboard para mostrar estadísticas relacionadas con la actividad del usuario.

#### Funcionalidades

1. Crear la página principal del dashboard.
2. Mostrar estadísticas generales de actividad.
3. Mostrar gráficas de emociones detectadas.
4. Mostrar estadísticas de películas recomendadas.
5. Organizar los datos por períodos, cuando el backend lo permita.
6. Utilizar Recharts para la representación gráfica.
7. Manejar estados de carga, error y ausencia de información.
8. Actualizar las estadísticas utilizando los datos proporcionados por el backend.

#### Archivos propuestos

```text
src/
├── pages/
│   └── Dashboard/
│       ├── Dashboard.jsx
│       └── Dashboard.css
├── components/
│   └── dashboard/
│       ├── DashboardStats.jsx
│       ├── EmotionChart.jsx
│       └── ActivityChart.jsx
└── services/
    └── dashboardService.js
```

### 3.5. Diseño visual y estilos globales

**Branch:** `feature/global-styles`

Responsable de establecer la identidad visual y mantener la consistencia de diseño en todas las páginas de Butaca.

#### Funcionalidades

1. Definir la paleta de colores.
2. Definir las tipografías y tamaños de texto.
3. Establecer márgenes, espaciados y dimensiones.
4. Crear estilos reutilizables.
5. Definir estilos generales para botones, formularios, tarjetas y otros componentes.
6. Diseñar los estados hover, focus, active y disabled.
7. Implementar el diseño responsive.
8. Mantener consistencia visual entre las páginas desarrolladas por ambos integrantes.
9. Revisar que los componentes compartidos utilicen los estilos establecidos.

#### Archivos propuestos

```text
src/
├── styles/
│   ├── variables.css
│   ├── global.css
│   ├── typography.css
│   └── utilities.css
├── components/
│   └── common/
│       ├── Button.jsx
│       ├── Loader.jsx
│       └── EmptyState.jsx
└── index.css
```

El integrante responsable del diseño visual definirá los estilos generales y los componentes comunes. El otro integrante deberá utilizar estos recursos al desarrollar sus páginas y componentes.

---

# 4. Responsabilidades del Integrante 2

## Área: Autenticación, navegación y películas

Responsable de desarrollar el acceso a la aplicación, la navegación entre páginas y las funcionalidades relacionadas con el catálogo de películas, favoritos y recomendaciones.

### 4.1. Autenticación

**Branch:** `feature/auth-navigation`

Implementar el sistema de autenticación utilizando Supabase Auth.

#### Funcionalidades

1. Crear la página de inicio de sesión.
2. Implementar inicio de sesión con Google.
3. Implementar inicio de sesión con GitHub.
4. Manejar las sesiones mediante Supabase Auth.
5. Detectar si existe una sesión activa.
6. Implementar cierre de sesión.
7. Manejar errores durante la autenticación.
8. Proteger las páginas que requieran autenticación.
9. Gestionar la redirección del usuario después de iniciar sesión.
10. Mantener disponible la información básica del usuario autenticado para el resto de la aplicación.

#### Archivos propuestos

```text
src/
├── pages/
│   └── Login/
│       ├── Login.jsx
│       └── Login.css
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useAuth.js
├── services/
│   └── supabase.js
└── routes/
    └── ProtectedRoute.jsx
```

### 4.2. Navegación y estructura principal

**Branch:** `feature/auth-navigation`

Crear la estructura de navegación general de Butaca.

#### Funcionalidades

1. Crear el menú de navegación.
2. Crear el encabezado principal.
3. Mostrar información del usuario autenticado.
4. Agregar navegación entre las páginas.
5. Implementar rutas protegidas.
6. Implementar navegación responsive.
7. Crear un menú lateral o equivalente, según el diseño establecido.
8. Implementar las redirecciones necesarias después del inicio y cierre de sesión.
9. Integrar las páginas desarrolladas por ambos integrantes en el sistema de rutas.

#### Archivos propuestos

```text
src/
├── components/
│   └── layout/
│       ├── Navbar.jsx
│       ├── Sidebar.jsx
│       └── MainLayout.jsx
└── routes/
    └── AppRoutes.jsx
```

### 4.3. Catálogo y tendencias de películas

**Branch:** `feature/movies-favorites`

Desarrollar la página principal donde se mostrarán las películas disponibles y las tendencias.

#### Funcionalidades

1. Crear la página principal del catálogo.
2. Consumir el endpoint de tendencias del backend.
3. Mostrar películas y sus pósteres.
4. Mostrar título y tipo de contenido.
5. Implementar tarjetas de películas.
6. Manejar estados de carga y error.
7. Consultar información adicional de las películas, según los endpoints disponibles.
8. Integrar los componentes necesarios para mostrar las películas recomendadas.

#### Archivos propuestos

```text
src/
├── pages/
│   └── Home/
│       ├── Home.jsx
│       └── Home.css
├── components/
│   └── movies/
│       ├── MovieCard.jsx
│       ├── MovieGrid.jsx
│       └── MovieDetails.jsx
└── services/
    └── movieService.js
```

### 4.4. Favoritos

**Branch:** `feature/movies-favorites`

Implementar la administración de películas favoritas del usuario.

#### Funcionalidades

1. Crear la página de favoritos.
2. Consultar los favoritos del usuario.
3. Agregar películas a favoritos.
4. Eliminar películas de favoritos.
5. Actualizar la interfaz después de cada operación.
6. Mostrar un estado cuando el usuario no tenga favoritos.
7. Manejar errores de las operaciones.
8. Permitir acceder a los detalles de las películas favoritas.

#### Archivos propuestos

```text
src/
├── pages/
│   └── Favorites/
│       ├── Favorites.jsx
│       └── Favorites.css
├── components/
│   └── movies/
│       └── FavoriteButton.jsx
└── services/
    └── favoritesService.js
```

### 4.5. Recomendaciones

**Branch:** `feature/movies-favorites`

Desarrollar la página donde se mostrarán las películas recomendadas por el sistema.

#### Funcionalidades

1. Crear la página de recomendaciones.
2. Consultar las recomendaciones proporcionadas por el backend.
3. Mostrar las películas recomendadas.
4. Mostrar información relevante de cada recomendación.
5. Manejar estados de carga, error y ausencia de resultados.
6. Integrar los componentes reutilizables del catálogo.
7. Coordinar con el integrante 1 la integración de las emociones detectadas y las recomendaciones asociadas.

#### Archivos propuestos

```text
src/
├── pages/
│   └── Recommendations/
│       ├── Recommendations.jsx
│       └── Recommendations.css
└── services/
    └── recommendationsService.js
```

---

# 5. Archivos compartidos y coordinación

Algunos archivos pueden afectar el funcionamiento general de la aplicación. Para evitar conflictos, se establece la siguiente distribución:

| Archivo o carpeta | Responsable |
|---|---|
| `src/App.jsx` | Integrante 2 |
| `src/main.jsx` | Ambos, con coordinación previa |
| `src/index.css` | Integrante 1 |
| `src/styles/` | Integrante 1 |
| `src/components/common/` | Integrante 1 |
| `src/components/layout/` | Integrante 2 (estructura) / Integrante 1 (estilos globales) |
| `src/context/AuthContext.jsx` | Integrante 2 |
| `src/routes/` | Integrante 2 |
| `src/services/` | Cada integrante en sus propios archivos |
| `src/pages/History/` | Integrante 1 |
| `src/pages/Dashboard/` | Integrante 1 |
| `src/pages/Login/` | Integrante 2 |
| `src/pages/Home/` | Integrante 2 |
| `src/pages/Favorites/` | Integrante 2 |
| `src/pages/Recommendations/` | Integrante 2 |
| `src/components/camera/` | Integrante 1 |
| `src/components/history/` | Integrante 1 |
| `src/components/dashboard/` | Integrante 1 |
| `src/components/movies/` | Integrante 2 |
| `src/hooks/useAuth.js` | Integrante 2 |
| `src/hooks/useCamera.js` | Integrante 1 |
| `src/hooks/useEmotionDetection.js` | Integrante 1 |

### Reglas para archivos compartidos

- El integrante 1 establece las variables y estilos globales.
- El integrante 2 desarrolla la estructura funcional de navegación.
- Ambos deben utilizar los componentes comunes siempre que sea posible.
- No se deben duplicar componentes que ya existan.
- Los cambios en `App.jsx`, `main.jsx` y las rutas deben coordinarse antes de integrarse.
- Cada integrante debe avisar cuando necesite modificar un archivo que pertenece al otro.

---

# 6. Uso de Motion para animaciones

Se utilizará Motion para React como biblioteca de animaciones de la aplicación.

Se utilizará la versión gratuita y de código abierto, sin necesidad de contratar Motion+.

**Instalación:**

```bash
npm install motion
```

**Importación:**

```jsx
import { motion, AnimatePresence } from 'motion/react'
```

### Responsabilidades

| Integrante | Animaciones |
|---|---|
| Integrante 1 | Historial, selección de días, dashboard, cámara y resultados de emociones. |
| Integrante 2 | Tarjetas de películas, catálogo, navegación, autenticación y favoritos. |
| Ambos | Mantener consistencia en duración, transiciones y comportamiento de las animaciones. |

### Reglas de uso

1. Utilizar Motion para transiciones, interacciones y aparición de componentes.
2. Utilizar CSS para estilos normales y efectos sencillos.
3. Evitar animaciones innecesarias.
4. No retrasar acciones importantes por efectos visuales.
5. Respetar la preferencia de accesibilidad `prefers-reduced-motion`.
6. Mantener las animaciones consistentes en toda la aplicación.

No se creará una rama exclusiva para Motion. Cada integrante implementará las animaciones dentro de sus propios componentes.

---

# 7. Orden recomendado de desarrollo

Para evitar dependencias y facilitar la integración, se propone trabajar en las siguientes etapas:

### Etapa 1. Estructura funcional y diseño

**Integrante 1:**
- Definir paleta de colores.
- Crear variables CSS.
- Definir tipografías.
- Crear estilos globales.
- Crear componentes comunes.

**Integrante 2:**
- Implementar autenticación.
- Crear la estructura de rutas.
- Crear la navegación principal.
- Implementar las rutas protegidas.

### Etapa 2. Funcionalidades principales

**Integrante 1:**
- Crear la página de historial.
- Implementar la cuadrícula anual de emociones.
- Crear los detalles de cada día.
- Desarrollar el dashboard y sus gráficas.

**Integrante 2:**
- Crear el catálogo.
- Consumir el endpoint de tendencias.
- Implementar favoritos.
- Crear la página de recomendaciones.

### Etapa 3. Cámara y detección de emociones

**Integrante 1:**
- Implementar la solicitud de permisos.
- Implementar el acceso a la cámara.
- Integrar Face-api.js.
- Implementar la detección de emociones.
- Enviar los resultados necesarios al backend.

**Integrante 2:**
- Apoyar la integración de las recomendaciones relacionadas con las emociones.
- Verificar que la navegación y la autenticación funcionen correctamente con las nuevas páginas.

### Etapa 4. Integración y pruebas

**Ambos integrantes:**
- Integrar todas las funcionalidades en `develop`.
- Verificar que todas las páginas utilicen los estilos globales.
- Probar la navegación entre páginas.
- Verificar la autenticación.
- Comprobar la comunicación con el backend.
- Probar los estados de carga, error y ausencia de información.
- Verificar el funcionamiento de la cámara y los permisos.
- Revisar las animaciones.
- Probar el diseño responsive.
- Ejecutar las pruebas de compilación y lint.

---

# 8. Consideraciones para la integración con el backend

Antes de implementar las funcionalidades que dependen de información del servidor, ambos integrantes deben confirmar con el equipo de backend los endpoints disponibles y sus contratos.

Se debe verificar especialmente:

| Funcionalidad | Información necesaria |
|---|---|
| Autenticación | Integración entre Supabase Auth y el backend, identificación del usuario y validación de sesión. |
| Catálogo | Endpoint de tendencias y estructura de las películas. |
| Favoritos | Endpoints para consultar, agregar y eliminar favoritos. |
| Recomendaciones | Endpoint y estructura de las recomendaciones. |
| Emociones | Endpoint para registrar las emociones detectadas y su confianza. |
| Historial | Endpoint para consultar emociones y películas recomendadas por fecha. |
| Dashboard | Endpoint y estructura de las estadísticas del usuario. |

### Consideraciones técnicas y de seguridad

- El frontend consumirá la API mediante `fetch`.
- La comunicación con los servicios del backend se centralizará en los archivos correspondientes de `src/services/`.
- No se conectará directamente el frontend a la base de datos.
- Supabase se utilizará para autenticación.
- No se expondrán claves privadas, tokens de TMDB ni claves `service_role` en el frontend.
- La detección facial se realizará localmente en el navegador.
- No se enviarán imágenes de la cámara al backend.
- Las operaciones que requieran autenticación deberán utilizar el mecanismo de autorización acordado con backend.

---

# 9. Resultado esperado

Al finalizar el desarrollo, Butaca deberá contar con:

- Inicio de sesión mediante Google y GitHub.
- Navegación entre las distintas secciones.
- Catálogo de películas y tendencias.
- Sistema de favoritos.
- Página de recomendaciones.
- Acceso a la cámara mediante consentimiento del usuario.
- Detección local de emociones.
- Historial anual de emociones y películas recomendadas.
- Dashboard con estadísticas y gráficas.
- Diseño responsive y consistente.
- Animaciones e interacciones implementadas con Motion.

**Objetivo del equipo:** desarrollar un frontend organizado, funcional, visualmente consistente y correctamente integrado con el backend, manteniendo responsabilidades claras y evitando conflictos durante el trabajo colaborativo.