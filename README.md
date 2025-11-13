# Prueba Técnica Full-Stack: Implementación de Autenticación - Tiendas DAKA.CA

¡Bienvenido/a a la prueba técnica! Este reto está diseñado para evaluar tus habilidades en el desarrollo de aplicaciones web full-stack utilizando Nest.js y Vue.js.

Se te proporciona un monorepo que contiene una aplicación base con la funcionalidad de registro de usuarios ya implementada y conectada.

## Objetivo del Reto

Tu misión es implementar el flujo completo de inicio de sesión (login) en la aplicación. Deberás desarrollar tanto la lógica en el backend para validar credenciales y generar tokens, como la interfaz en el frontend para que los usuarios puedan iniciar sesión y acceder a una ruta protegida.

Una vez completado el sistema de autenticación, implementarás una funcionalidad adicional: un sistema de visualización y gestión de sprites de Pokémon que utilizará WebSockets para comunicación en tiempo real.

## Flujo Esperado

El flujo de autenticación que debes implementar se detalla en el siguiente diagrama. Es crucial que tu solución siga esta secuencia de pasos para ser considerada correcta.

![alt text](auth_diagram.png)

El proceso se divide en dos fases principales:

1. **Inicio de Sesión (Pasos 1-4)**: El cliente envía las credenciales (username, password). El servidor las valida y, si son correctas, genera un accessToken que devuelve al cliente.

2. **Acceso a Ruta Protegida (Pasos 5-7)**: El cliente utiliza el accessToken recibido para hacer una solicitud a una ruta protegida (/auth/me). El servidor valida el token y, si es válido, devuelve la información del usuario.

## Requisitos Técnicos

A continuación se detallan las tareas que debes completar en cada parte del proyecto.

### ✅ Backend (Nest.js)

1. **Crear el Endpoint de Login**:
   - Implementa una ruta POST `/auth/login` que reciba `username` y `password`.
   - Valida que el usuario exista en la base de datos y que la contraseña sea correcta. Importante: Utiliza una comparación segura para las contraseñas (ej. `bcrypt.compare`).

2. **Generar Token JWT**:
   - Si las credenciales son válidas, genera un JSON Web Token (JWT).
   - El token debe incluir el `userId` y el `username` en su payload.
   - Devuelve el `accessToken` junto con los datos básicos del usuario en la respuesta.

3. **Crear una Ruta Protegida**:
   - Implementa una ruta GET `/auth/me`.
   - Asegura esta ruta para que solo sea accesible con un JWT válido en la cabecera `Authorization` (usando el esquema `Bearer`).
   - Si el token es válido, esta ruta debe devolver la información del usuario contenida en el token.

### ✅ Frontend (Vue.js)

1. **Crear Formulario de Login**:
   - Desarrolla un nuevo componente con un formulario para que el usuario ingrese su `username` y `password`. No es necesario aplicar estilos.
   - Añade la ruta correspondiente en el router para hacer accesible esta vista.

2. **Lógica de Inicio de Sesión**:
   - Al enviar el formulario, realiza una petición POST al endpoint `/auth/login` del backend.
   - Si el login es exitoso, almacena el `accessToken` de forma segura en el cliente (puedes usar `localStorage` o una store de Pinia).
   - Si falla, muestra un mensaje de error al usuario.

3. **Rutas Protegidas y Perfil de Usuario**:
   - Crea una vista de "Perfil" que solo sea accesible para usuarios autenticados.
   - Implementa un navigation guard en Vue Router para proteger esta ruta. Si un usuario no autenticado intenta acceder, redirígelo a la página de login.
   - En la vista de "Perfil", realiza una petición GET a `/auth/me` enviando el `accessToken` en la cabecera `Authorization`.
   - Muestra en pantalla la información del usuario (`username`, `userID`) que recibas del backend.

## Tarea Adicional: Aplicación de Visualización y Gestión de Sprites de Pokémon

Una vez completado el sistema de autenticación, deberás implementar una funcionalidad adicional que permita a los usuarios autenticados descargar y visualizar sprites de Pokémon al azar. Esta funcionalidad utilizará WebSockets para comunicación en tiempo real entre el frontend y backend.

### Objetivo extra (no obligatorio).

Crear una aplicación web que permita a los usuarios descargar y visualizar sprites de Pokémon al azar. La aplicación usará Vue.js para el frontend y NestJS para el backend, comunicándose ambos a través de WebSocket.

### Requerimientos Generales

- **Frontend**: Utilizar Vue.js para implementar un botón que, al ser pulsado, inicie la descarga de un sprite de Pokémon al azar. Los sprites descargados se mostrarán en una galería que permitirá al usuario eliminar los que desee.
- **Backend**: Emplear NestJS para manejar las solicitudes y enviar las imágenes descargadas al cliente mediante WebSocket.

### ✅ Especificaciones Detalladas

#### Backend (NestJS)

1. **Configuración de WebSocket**:
   - Configurar un Gateway WebSocket en NestJS para manejar conexiones en tiempo real.
   - Implementar autenticación WebSocket utilizando los JWT generados en el sistema de login.

2. **Endpoint de Descarga**:
   - Crear un endpoint para procesar solicitudes de descarga de sprites de Pokémon.
   - Descargar un sprite al azar desde la PokeAPI (https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon).
   - Enviar el sprite descargado al frontend a través de WebSocket.

3. **Gestión de Sprites**:
   - Implementar funcionalidad para almacenar temporalmente los sprites descargados.
   - Crear endpoint para eliminar sprites específicos.

#### Frontend (Vue.js)

1. **Interfaz de Usuario**:
   - Diseñar una interfaz dentro del área autenticada que incluya un botón para solicitar la descarga de sprites.
   - Crear un área para visualizar los sprites descargados en formato de galería.

2. **Visualización de Sprites**:
   - Mostrar los sprites de Pokémon en una galería dentro de la interfaz.
   - Permitir la eliminación de sprites individuales por parte del usuario.
   - Mostrar información básica del Pokémon (nombre, ID) junto con el sprite.

3. **Comunicación WebSocket**:
   - Establecer una conexión WebSocket autenticada para recibir los sprites descargados del backend.
   - Manejar eventos de conexión, desconexión y recepción de datos.
   - Implementar manejo de errores para conexiones WebSocket.


#### Dockerización

- Actualizar la configuración existente de Docker para incluir las nuevas dependencias.
- Asegurar que los WebSockets funcionen correctamente en el entorno containerizado.
- Configurar docker-compose para facilitar el despliegue completo de la aplicación.

### Entregables Adicionales

- Código fuente completo de la funcionalidad de Pokémon sprites integrada con el sistema de autenticación.
- Documentación sobre cómo usar la nueva funcionalidad.

## Criterios de Evaluación

### Funcionalidad Base (Autenticación)
- **Funcionalidad**: El flujo completo de login y acceso a rutas protegidas debe funcionar como se espera.
- **Seguridad**: Correcta implementación de la comparación de contraseñas y del uso de JWT para proteger rutas.

### Funcionalidad Adicional (Pokémon Sprites)
- **Comunicación WebSocket**: Correcta implementación de WebSockets con autenticación JWT.
- **Integración con APIs Externas**: Uso adecuado de la PokeAPI para obtener sprites de Pokémon.
- **Gestión de Estado**: Manejo eficiente del estado de los sprites en el frontend.

### Criterios Generales
- **Calidad del Código**: Se valorará un código limpio, legible, bien estructurado y que siga las buenas prácticas de cada framework.
- **Manejo de Errores**: La aplicación debe gestionar correctamente tanto los casos de éxito como los de error (ej. credenciales incorrectas, token inválido, errores de conexión WebSocket).
- **Arquitectura**: Separación clara de responsabilidades entre componentes y servicios.
- **Experiencia de Usuario**: Interfaz intuitiva y responsiva para ambas funcionalidades.

¡Mucha suerte!