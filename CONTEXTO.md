# CRUDA — Cervecería Artesanal · Contexto del proyecto

Demo landing page desplegada en `cruda.eslaboncero.me` via Coolify (auto-deploy desde GitHub: `dev-alons/cruda-cerveceria`).

---

## Arquitectura

| Archivo | Rol |
|---------|-----|
| `index.html` | Estructura: nav, sección journey (scrollytelling), catálogo, stats, contacto |
| `style.css` | Estilos: tema claro para el resto del sitio, sección journey oscura/cinematográfica |
| `main.js` | Lógica: Three.js 3D, motor de scroll, interpolación de escenas, animaciones |
| `GLTFLoader.js` | Copia local del loader de Three.js (r134) para cargar archivos .glb |
| `nginx.conf` | Sirve `.glb` con MIME type `model/gltf-binary` correcto |
| `Dockerfile` | nginx:alpine + copia de nginx.conf |
| `assets/Bottle.glb` | Modelo 3D de la botella (~608KB) |
| `assets/label.png` | Textura de la etiqueta (~246KB) |

---

## Motor de animación — Scrollytelling cinematográfico

La sección `.journey` tiene `height: 400vh`. El usuario scrollea y `onScroll()` calcula un `progress` (0→1) que se distribuye entre las 4 escenas.

```
progress = scrollY relativo / totalScroll
sceneIndex = floor(progress / (1 / numScenes - 1))
sceneT = fracción local dentro del segmento (0→1)
```

`interpolateScene(A, B, t)` hace lerp con easing entre los keyframes de dos escenas consecutivas. El resultado se aplica como `target3` y el loop de animación suaviza con lerp frame a frame (factor `0.04–0.07`).

---

## Las 4 escenas — Keyframes

### 01 · MISTERIO
- Cámara lejos (`Z=6.8`), botella entera visible pero oscura
- Sin etiqueta (`labelOpacity: 0`), silueta por contraluz (`rimInt: 2.2`)
- Texto: *"No es solo cerveza."*

### 02 · REVEAL
- Dolly in hasta `Z=2.4` — primer plano centrado en la etiqueta
- Botella frontal (`rotateY: 0`), etiqueta aparece
- Texto: *"Es carácter en estado líquido."*

### 03 · FRÍO
- Cámara baja dramática (`Y=-0.6`) mirando hacia arriba
- Niebla fría activa (`fogDensity: 0.07`), glow al máximo (`glowOp: 0.90`)
- Halo de contraluz fuerte (`rimInt: 2.5`)
- Texto: *"Fría. Intensa. Lista."*

### 04 · HERO
- Encuadre de producto premium, cámara lateral (`X=0.5, Z=5.0`)
- Iluminación completa, etiqueta visible, CTA aparece
- Texto: *"Descubre la experiencia."*

---

## Three.js — Setup y objetos

- **Renderer**: `WebGLRenderer` con alpha y antialias, DPR máx 2
- **Cámara**: `PerspectiveCamera` con FOV animado por escena + `lookAt()` dinámico
- **Niebla**: `THREE.FogExp2` — densidad animada por escena
- **Botella**: modelo GLB normalizado a `1.9 unidades` de altura, escala base `×1.15`
- **Materiales por mesh**:
  - `Bottle` → material original del GLB
  - `Cap` → `MeshPhongMaterial` dorado
  - `Mesh001` → `MeshStandardMaterial` con `label.png`, opacidad animada
  - `Mesh001_1`, `Mesh001_2` → ocultos (`visible: false`)
- **Glow sprite**: `THREE.Sprite` con `CanvasTexture` radial + `AdditiveBlending`
- **Partículas**: `THREE.Points` con 180 puntos flotando hacia arriba, opacity ligada a `fogDensity`
- **Luces**:
  - `ambientLight` (FFF5E0) — intensidad animada
  - `mainLight` (FFEAB0, pos -2,3,5) — intensidad animada
  - `rimLight` (FFCC80, pos 0.5,0.5,-3.5) — contraluz trasero, intensidad animada
  - `sideLight` (C8780A, pos 3,0,2) — acento lateral fijo

---

## Decisiones técnicas relevantes

- **GLTFLoader local**: La versión CDN de GLTFLoader no se registraba como `THREE.GLTFLoader` en r134. Se descargó localmente como `GLTFLoader.js`.
- **MIME type GLB**: nginx:alpine no sirve `.glb` por defecto. Se creó `nginx.conf` con tipo explícito.
- **bottleX/Y en unidades world**: Las posiciones de botella en `SCENES` son directamente unidades Three.js, no píxeles.
- **Cinematic text transitions**: CSS classes `.visible` / `.exiting` con `setTimeout(350ms)` para transición out→in entre escenas.

---

## Pendientes / Ideas futuras

- Afinar posiciones de cámara por escena según feedback visual
- Considerar luz adicional azul/fría para la escena 03 (actualmente usa solo rimLight cálido)
- Rotación orbital suave en escena 04 (Hero)
- Versión mobile: revisar canvas sizing y texto en pantallas pequeñas
