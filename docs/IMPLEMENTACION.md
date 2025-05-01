# Documentación de Implementación - Sistema de Monitoreo de Vehículo Eléctrico

## Introducción
Este documento describe la implementación de un sistema de monitoreo para vehículos eléctricos desarrollado como proyecto para la materia de Construcción de Sistemas. El sistema permite monitorear en tiempo real diversos parámetros del vehículo y compartir esta información a través de diferentes canales de comunicación.

## Arquitectura del Sistema
El sistema está construido sobre Vue 3 y utiliza una arquitectura basada en componentes con las siguientes tecnologías principales:

- **Frontend**: Vue 3 + Vite
- **Comunicación en tiempo real**: MQTT
- **Servicios de comunicación**: SendGrid (Email) y WhatsApp API
- **Estado global**: Pinia Store

## Implementación de MQTT

### Configuración del Broker
Para la comunicación en tiempo real, utilizamos MQTT sobre WebSocket. La configuración se maneja a través de variables de entorno:

```env
VITE_MQTT_BROKER_URL=ws://localhost:9001
VITE_MQTT_USERNAME=auto_electrico
VITE_MQTT_PASSWORD=construccion_sistemas
```

### ¿Por qué MQTT?
Elegimos MQTT porque:
1. Es liviano y eficiente para IoT
2. Tiene bajo overhead en la red
3. Soporta comunicación bidireccional
4. Ideal para datos en tiempo real como telemetría vehicular

### Tópicos Implementados
- `vehicle/battery` - Nivel de batería
- `vehicle/location` - Ubicación GPS
- `vehicle/consumption` - Consumo energético
- `vehicle/maintenance` - Estado de mantenimiento

## Implementación de SendGrid

### Configuración
La integración con SendGrid se realiza mediante su API REST. Las credenciales se manejan de forma segura:

```env
VITE_SENDGRID_API_KEY=UNA_API_QUE_SEA_SEGURA (PENDIENTE)
VITE_FROM_EMAIL=correotest@correo.com (PENDIENTE)
```

### Estructura del Servicio
Implementamos un servicio dedicado (`emailService.js`) que maneja:
- Configuración de la API
- Formateo de correos en HTML
- Manejo de errores
- Envío asíncrono

### Formato de Correos
Los correos incluyen:
- Datos de telemetría actuales
- Estadísticas de consumo
- Información de mantenimiento
- Diseño responsive con CSS

## Integración con WhatsApp

### Implementación
Utilizamos la API de WhatsApp Web para compartir datos. La implementación es simple pero efectiva:

1. Formateamos los datos con emojis para mejor legibilidad
2. Codificamos el texto para URLs
3. Utilizamos el esquema `wa.me` para compartir

### Ejemplo de Formato
```javascript
🔋 Batería: XX%
🛣️ Autonomía: XX km
📍 Estado: Activo/Inactivo
📌 Ubicación: Ciudad, País
```

## Consideraciones de Seguridad

### MQTT
- Autenticación mediante usuario/contraseña
- Conexión WebSocket segura
- Validación de datos recibidos

### SendGrid
- API Key almacenada en variables de entorno
- Validación de direcciones de correo
- Manejo seguro de errores

### WhatsApp
- No se almacenan datos sensibles
- Enlaces generados dinámicamente
- Sanitización de datos compartidos

## Mejoras Futuras Propuestas

1. **MQTT**
   - Implementar QoS configurable
   - Añadir SSL/TLS
   - Persistencia de mensajes

2. **SendGrid**
   - Templates personalizables
   - Programación de reportes
   - Tracking de apertura/clicks

3. **WhatsApp**
   - Integración con WhatsApp Business API
   - Mensajes interactivos
   - Automatización de compartición

## Conclusión
Esta implementación demuestra la integración exitosa de múltiples tecnologías para crear un sistema de monitoreo robusto y funcional. La combinación de MQTT para datos en tiempo real, SendGrid para comunicaciones formales y WhatsApp para compartir rápido, proporciona una solución completa para el monitoreo de vehículos eléctricos.

---
Documentación elaborada por Frasson Hector Oscar, Pirro Luciano, Duete Guillermo
Materia: Construcción de Sistemas
Fecha: 1° de Mayo 2025 