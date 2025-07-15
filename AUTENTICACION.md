# Sistema de Autenticación Integrado

## Descripción

Se ha integrado el sistema de autenticación con el backend real, manteniendo compatibilidad con el sistema de pruebas.

## Funcionalidades Implementadas

### 1. Servicio de Autenticación (`authService.js`)

- **Login con backend real**: Endpoint `POST /Authentication/Login`
- **Validación de tokens**: Endpoint `GET /Authentication/ValidateToken`  
- **Logout**: Endpoint `POST /Authentication/Logout`
- **Manejo de errores**: Captura y manejo de errores de conectividad
- **Configuración SSL**: Soporte para HTTPS en desarrollo local

### 2. Store de Autenticación (`auth.js`)

- **Doble método de login**: Backend real + Sistema mock
- **Gestión de tokens**: Almacenamiento en localStorage
- **Validación de sesiones**: Verificación automática de tokens
- **Manejo de invitados**: Sistema de gestión de usuarios invitados

### 3. Interfaz de Usuario (`LoginView.vue`)

- **Tabs dinámicos**: Cambio entre "Sistema Principal" y "Sistema de Pruebas"
- **Formularios específicos**:
  - Backend real: userName + PIN
  - Sistema mock: email + password
- **Instrucciones claras**: Guía para cada método
- **Manejo de errores**: Visualización de errores de autenticación

## Configuración del Backend

### Endpoint esperado

```
POST https://localhost:7263/api/Authentication/Login
Content-Type: application/json

{
  "userName": "Guille",
  "pin": 123
}
```

### Respuesta esperada

```json
{
  "result": {
    "user": {
      "id": 1,
      "userName": "Guille",
      "email": "guilleramone@gmail.com",
      "pin": 123,
      "userRole": 1,
      "userRoleDescription": "Owner"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "type": "",
  "version": "",
  "messages": [],
  "statusResponse": {
    "code": 200,
    "messages": "OK"
  },
  "errors": {}
}
```

## Variables de Entorno

### Archivo `.env`

```
VITE_API_URL=https://localhost:7263/api
VITE_APP_ENV=development
VITE_DEBUG=true
VITE_IGNORE_SSL_ERRORS=true
```

## Uso del Sistema

### Sistema Principal (Backend Real)

1. Seleccionar la tab "Sistema Principal"
2. Ingresar userName (ej: "Guille")  
3. Ingresar PIN (ej: 123)
4. Hacer clic en "Iniciar sesión"

### Sistema de Pruebas (Mock)

1. Seleccionar la tab "Sistema de Pruebas"
2. Usar credenciales de prueba:
   - **Propietario**: <owner@example.com> / owner123
   - **Invitado**: <invitado@example.com> / invitado123

## Manejo de Errores

### Errores de Conectividad

- Error 400: Datos de login inválidos
- Error 401: Credenciales incorrectas
- Error 403: Acceso denegado
- Error 404: Servicio no encontrado
- Error 500: Error interno del servidor
- Error de red: Problema de conectividad

### Fallback Automático

Si el backend no está disponible, el sistema continúa funcionando con el sistema mock.

## Consideraciones de Seguridad

### En Desarrollo

- Los errores SSL están deshabilitados para localhost
- Los tokens se almacenan en localStorage
- Se muestran mensajes de error detallados

### En Producción

- Activar verificación SSL completa
- Considerar usar sessionStorage en lugar de localStorage
- Ocultar mensajes de error detallados

## Próximos Pasos

1. **Validar endpoints**: Verificar que el backend esté funcionando
2. **Probar conectividad**: Hacer pruebas con diferentes escenarios
3. **Ajustar respuestas**: Adaptar según la respuesta real del backend
4. **Implementar refresh tokens**: Para sesiones de larga duración
5. **Mejorar manejo de errores**: Mensajes más específicos

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura de Archivos

```
src/
├── services/
│   └── authService.js       # Servicio de autenticación
├── store/
│   └── auth.js              # Store de autenticación
├── views/
│   └── LoginView.vue        # Interfaz de login
├── config/
│   └── development.js       # Configuración de desarrollo
└── .env                     # Variables de entorno
```
