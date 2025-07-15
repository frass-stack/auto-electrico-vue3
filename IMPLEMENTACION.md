## Ejecución en dispositivos móviles (Mobile)

### Tecnologías utilizadas
- **Vite**: Servidor de desarrollo para Vue 3
- **Vue 3**: Framework principal de la aplicación
- **QRCode.vue**: Biblioteca para generación de códigos QR
- **@zxing/library**: Biblioteca para escaneo de códigos QR

### Pasos realizados
1. Se configuró el script de desarrollo en `package.json` para permitir el acceso desde la red local:
   ```json
   "dev": "vite --host"
   ```
2. Se inició el servidor de desarrollo con:
   ```bash
   npm run dev
   ```
3. Se identificó la IP local de la máquina (por ejemplo, `192.168.0.61`).

### Acceso mediante QR
La aplicación ofrece dos formas de acceso móvil:

1. **Escaneo de QR**:
   - En la pantalla de login, selecciona la pestaña "Escanear QR"
   - Usa la cámara de tu dispositivo móvil para escanear el código QR
   - La aplicación se abrirá automáticamente en tu dispositivo

2. **Generación de QR**:
   - En la pantalla de login, selecciona la pestaña "Acceso Móvil"
   - Se mostrará un código QR que puedes escanear con cualquier dispositivo
   - También puedes copiar la URL directamente

### Acceso directo
Desde cualquier dispositivo móvil conectado a la misma red WiFi, se puede acceder a la aplicación ingresando en el navegador:
```
http://<IP_LOCAL>:5173
```
Ejemplo: `http://192.168.0.61:5173`

---

## Ejecución como aplicación de escritorio (Desktop)

### Tecnologías utilizadas
- **Electron**: Framework para empaquetar aplicaciones web como apps de escritorio multiplataforma
- **Vite**: Generador de archivos estáticos para producción
- **Vue 3**: Framework principal de la aplicación
- **electron-builder**: Herramienta para crear instaladores ejecutables

### Pasos realizados
1. Se creó el archivo principal de Electron (`electron/main.cjs`) para cargar la app Vue:
   - En desarrollo, carga `http://localhost:5173`.
   - En producción, carga el archivo `dist/index.html` generado por Vite.
2. Se agregó la configuración de scripts en `package.json`:
   ```json
   "electron:dev": "cross-env NODE_ENV=development electron electron/main.cjs",
   "electron:build": "electron-builder"
   ```
3. Para producción:
   - Se ejecuta `npm run build` para generar la carpeta `dist` con los archivos estáticos de la app Vue.
   - Se ejecuta `npm run electron:build` para empaquetar la aplicación y generar un instalador ejecutable en la carpeta `dist_electron`.
4. El ejecutable generado permite ejecutar la aplicación de escritorio **sin necesidad de tener el servidor de desarrollo corriendo**. 