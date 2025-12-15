# 🎧 DJ Cats YouTube Player - Instrucciones

## 📋 Pasos para completar la configuración:

### 1. **Obtener API Key de Google** (GRATIS)
1. Ve a: https://console.developers.google.com
2. Crea un proyecto nuevo o selecciona uno existente
3. Ve a "Biblioteca" y busca "YouTube Data API v3"
4. Haz click en "Habilitar"
5. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
6. Copia tu API Key

### 2. **Configurar el reproductor**
1. Abre `youtube-player.js`
2. Busca la línea: `this.apiKey = 'TU_API_KEY_AQUI';`
3. Reemplaza `TU_API_KEY_AQUI` con tu API Key real

### 3. **Agregar tus canciones favoritas**
Para agregar canciones, solo necesitas el ID del video de YouTube:

**Ejemplo:**
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- ID: `dQw4w9WgXcQ` (la parte después de `v=`)

```javascript
{
    title: "Nombre de la canción",
    artist: "Nombre del artista",
    youtubeId: "dQw4w9WgXcQ"  // Solo el ID
}
```

### 4. **Activar el reproductor YouTube**
En `index.html`, reemplaza:
```html
<script src="music-player.js"></script>
```

Por:
```html
<script src="youtube-player.js"></script>
```

## 🎵 **Ejemplos de IDs populares:**

```javascript
// Música Lo-Fi
"5qap5aO4i9A"  // Lofi hip hop radio - beats to relax/study to

// Música Electrónica  
"NUYvbT6vTPs"  // Best of EDM Mix

// Música Relajante
"jfKfPfyJRdk"  // Relaxing Music for Stress Relief

// Música Pop
"kJQP7kiw5Fk"  // Despacito - Luis Fonsi

// Música Clásica
"jgpJVI3tDbY"  // Classical Music for Studying
```

## ✅ **Ventajas del YouTube Player:**
- ✅ No necesitas descargar archivos
- ✅ Acceso a millones de canciones
- ✅ Siempre actualizado
- ✅ Gratis (con límites generosos)
- ✅ Funciona en cualquier dispositivo

## 🎧 **Controles disponibles:**
- **Barra espaciadora:** Play/Pause
- **Flecha izquierda:** Canción anterior
- **Flecha derecha:** Siguiente canción
- **Click en barra de progreso:** Saltar a posición
- **🎵:** Mostrar/ocultar playlist

## 🚀 **¡Listo para usar!**
Una vez configurado, tendrás acceso a toda la música de YouTube con tu diseño DJ Cats personalizado.

¡Disfruta tu reproductor! 🐱🎶