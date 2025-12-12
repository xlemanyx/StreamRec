# 🎬 StreamRec - Plataforma de Recomendaciones de Películas para Streamers

Una aplicación web ligera y fluida donde streamers de Twitch y Kick pueden recibir recomendaciones de películas de su comunidad. Interfaz estilo Netflix con trailers automáticos.

## ✨ Características

### Para Streamers
- 🔐 Autenticación con Twitch, Kick o Discord
- 🎨 Página personalizada con URL compartible
- 🌍 Selección de idioma para trailers (Español, English, Français, etc.)
- 🔞 Filtro +18 para evitar baneos
- 📊 Vista de todas las recomendaciones de la comunidad

### Para la Comunidad
- 👍 Recomendar películas (requiere login)
- 👎 Dar dislike a películas
- 📋 Ver lista de usuarios que recomiendan cada película
- 🎬 Trailers automáticos al pasar el mouse

### Para Administradores
- 👑 Acceso exclusivo para el usuario "lemany01"
- ✏️ Modificar puntuaciones de películas
- 🗑️ Eliminar recomendaciones
- 📊 Dashboard con estadísticas
- 📝 Registro de acciones de admin

## 🚀 Cómo Usar

### Opción 1: Abrir Localmente (Más Fácil)

1. Navega a la carpeta `streamrec`
2. Haz doble clic en `index.html`
3. ¡Listo! La aplicación se abrirá en tu navegador

### Opción 2: Servidor Local (Recomendado)

Si tienes Python instalado:

```bash
cd streamrec
python -m http.server 8000
```

Luego abre: http://localhost:8000

### Opción 3: Live Server (VS Code)

1. Instala la extensión "Live Server" en VS Code
2. Abre la carpeta `streamrec` en VS Code
3. Click derecho en `index.html` → "Open with Live Server"

## 📖 Guía de Uso

### Para Streamers

1. **Iniciar Sesión**
   - Click en "Iniciar Sesión"
   - Elige tu plataforma (Twitch, Kick, Discord)
   - Ingresa tu nombre de usuario
   - Marca "Soy streamer"

2. **Configurar tu Página**
   - Selecciona el idioma de los trailers
   - Activa/desactiva el filtro +18
   - Copia el link de tu página y compártelo con tu comunidad

3. **Ver Recomendaciones**
   - Las películas aparecen en cuadrícula estilo Netflix
   - Pasa el mouse para ver el trailer
   - Número de recomendaciones visible en cada película
   - Click en el badge para ver quién recomendó

### Para Usuarios

1. **Iniciar Sesión**
   - Click en "Iniciar Sesión"
   - Elige tu plataforma
   - Ingresa tu nombre de usuario

2. **Recomendar Películas**
   - Ve a la página de tu streamer favorito
   - Busca películas o explora las populares
   - Click en "👍 Recomendar" para recomendar
   - Click en "👎 Dislike" si no te gusta

### Para el Administrador (lemany01)

1. **Acceder al Panel**
   - Inicia sesión con el usuario "lemany01" en Twitch
   - Aparecerá el link "Admin" en la navegación

2. **Gestionar Contenido**
   - Ver estadísticas globales
   - Modificar puntuaciones de películas (✏️)
   - Eliminar recomendaciones (🗑️)
   - Ver registro de acciones

## 🔧 Configuración de OAuth (Para Producción)

Actualmente la app funciona en modo demo. Para producción con OAuth real:

### Twitch OAuth

1. Ve a [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Crea una nueva aplicación
3. Copia el Client ID
4. Actualiza `js/config.js`:
   ```javascript
   TWITCH_CLIENT_ID: 'tu_client_id_aqui',
   TWITCH_REDIRECT_URI: 'https://tu-dominio.com/auth/twitch'
   ```

### Discord OAuth

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a OAuth2 y copia el Client ID
4. Actualiza `js/config.js`:
   ```javascript
   DISCORD_CLIENT_ID: 'tu_client_id_aqui',
   DISCORD_REDIRECT_URI: 'https://tu-dominio.com/auth/discord'
   ```

## 🎨 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **API de Películas**: TMDb API
- **Trailers**: YouTube Embed API
- **Almacenamiento**: localStorage (fácil migración a base de datos)
- **Estilo**: Dark theme con glassmorphism y animaciones fluidas

## 📂 Estructura del Proyecto

```
streamrec/
├── index.html              # Página principal
├── css/
│   ├── globals.css         # Estilos globales y tema
│   └── movie-grid.css      # Estilos de la cuadrícula Netflix
├── js/
│   ├── config.js           # Configuración (API keys, OAuth)
│   ├── auth.js             # Sistema de autenticación
│   ├── tmdb.js             # Integración con TMDb API
│   ├── main.js             # Lógica principal
│   ├── streamer.js         # Lógica de página de streamer
│   └── admin.js            # Panel de administración
└── pages/
    ├── streamer.html       # Página de streamer
    └── admin.html          # Panel de administración
```

## 🎯 Características Técnicas

- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Trailers automáticos con YouTube
- ✅ Búsqueda de películas en tiempo real
- ✅ Filtrado por idioma
- ✅ Filtro de contenido adulto (+18)
- ✅ Sistema de recomendaciones con likes/dislikes
- ✅ Prevención de spam (requiere login)
- ✅ Panel de administración
- ✅ Registro de acciones de admin
- ✅ Modo demo sin backend

## 🔐 API Key Configurada

La aplicación ya incluye la API key de TMDb que proporcionaste:
- **TMDb API Key**: `69e57fd6cbf4ecbda92f864cf0ef0969`

## 🌐 Despliegue

### Netlify / Vercel (Gratis)

1. Sube la carpeta `streamrec` a GitHub
2. Conecta tu repositorio con Netlify o Vercel
3. ¡Despliega!

### GitHub Pages

1. Sube la carpeta a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona la branch y carpeta
4. Tu sitio estará en: `https://usuario.github.io/streamrec`

## 📝 Notas Importantes

- **Modo Demo**: La autenticación actual es simulada para desarrollo
- **localStorage**: Los datos se guardan localmente en el navegador
- **Migración**: Fácil migración a backend real (Node.js, Firebase, etc.)
- **Kick OAuth**: Kick no tiene OAuth público, se usa sistema basado en usuario

## 🎮 Modo Demo

Para probar rápidamente:

1. Abre `index.html`
2. Click en "Ver Demo"
3. Explora la interfaz sin necesidad de login

El usuario demo es "lemany01" (tiene permisos de administrador).

## 💡 Próximos Pasos

1. **Obtener credenciales OAuth** de Twitch y Discord
2. **Desplegar** en un dominio público
3. **Actualizar** las URLs de redirect en `config.js`
4. **Opcional**: Migrar a backend con base de datos real

## 🆘 Soporte

Si tienes problemas:

1. Verifica que la API key de TMDb esté configurada
2. Abre la consola del navegador (F12) para ver errores
3. Asegúrate de permitir cookies y localStorage
4. Prueba en modo incógnito si hay problemas de caché

## 📄 Licencia

Proyecto creado para streamers. Libre para uso y modificación.

---

**¡Disfruta compartiendo el cine con tu comunidad! 🍿**
