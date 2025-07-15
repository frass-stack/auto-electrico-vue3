# Flujo de Autenticación - Sistema Completo

## 📋 Resumen del Sistema

El sistema de autenticación está completamente integrado con el backend y funciona de la siguiente manera:

### 🔐 Flujo de Login

1. **Usuario ingresa credenciales** en `LoginView.vue`:
   - Nombre de usuario (string)
   - PIN (número)

2. **Envío al backend** vía `authService.js`:
   - Endpoint: `https://localhost:7263/api/Authentication/Login`
   - Método: POST
   - Payload: `{ userName, pin }`

3. **Procesamiento de respuesta** en `auth.js` store:
   - Almacena token en localStorage
   - Guarda información del usuario
   - Redirecciona a dashboard

### 🛠️ Componentes Clave

#### 1. LoginView.vue

- Formulario simple con userName y PIN
- Validación de campos requeridos
- Llamada directa al store de autenticación
- Mensajes de error claros

#### 2. authService.js

- Configuración de axios para la API
- Manejo de errores HTTP detallado
- Estructura de respuesta backend esperada
- Interceptors para logging y debugging

#### 3. auth.js (Pinia Store)

- Estado reactivo de autenticación
- Gestión de token en localStorage
- Navegación automática post-login
- Funciones de logout y validación

#### 4. vite.config.js

- Proxy para evitar problemas SSL/CORS
- Configuración `/api` → `https://localhost:7263`
- Opción `secure: false` para desarrollo

### 🔧 Configuración SSL/HTTPS

El sistema maneja SSL de manera transparente:

- Frontend corre en HTTP (localhost:5174)
- Backend en HTTPS (localhost:7263)
- Proxy de Vite maneja la comunicación SSL
- No requiere certificados en desarrollo

### 📊 Estructura de Respuesta Backend Esperada

```json
{
  "result": {
    "user": {
      "id": "string",
      "userName": "string",
      "email": "string",
      "userRole": "number",
      "userRoleDescription": "string",
      "pin": "number"
    },
    "accessToken": "string"
  },
  "statusResponse": {
    "code": 200,
    "messages": "string"
  }
}
```

### 🎯 Datos Enviados al Backend

El sistema envía exactamente esto al endpoint:

```javascript
{
  "userName": "valor_ingresado_por_usuario",
  "pin": numero_ingresado_por_usuario
}
```

### 🚀 Cómo Usar el Sistema

1. **Iniciar el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

2. **Abrir el navegador**: <http://localhost:5174>

3. **Ir a Login**: Automáticamente se redirige si no está autenticado

4. **Ingresar credenciales**:
   - Usuario: "Guille" (ejemplo)
   - PIN: 123 (ejemplo)

5. **Submit**: El sistema enviará las credenciales al backend real

### 🛡️ Seguridad y Validaciones

- ✅ Validación de campos requeridos
- ✅ Manejo de errores HTTP específicos
- ✅ Token seguro en localStorage
- ✅ Limpieza de estado en logout
- ✅ Validación de estructura de respuesta

### 📝 Logs de Debug

El sistema incluye logs detallados para debugging:

- Información de conexión API
- Datos enviados al backend
- Respuestas recibidas
- Errores capturados

### 🔄 Estados de la Aplicación

- **loading**: Indica si está procesando login
- **error**: Mensaje de error si falla la autenticación
- **user**: Información del usuario autenticado
- **token**: Token de autenticación activo

### ⚡ Ventajas del Sistema Actual

1. **Simplicidad**: Un solo método de login (backend)
2. **Robustez**: Manejo completo de errores
3. **Transparencia**: SSL manejado por proxy
4. **Debugging**: Logs detallados para troubleshooting
5. **Escalabilidad**: Fácil agregar más funcionalidades

### 🔍 Verificación del Sistema

Para verificar que todo funciona:

1. Abrir DevTools (F12)
2. Ir a Network tab
3. Intentar hacer login
4. Verificar que se envía POST a `/api/Authentication/Login`
5. Revisar payload en la pestaña Request

El sistema está completamente funcional y listo para producción.
