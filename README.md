# Prueba Técnica Full-Stack: Implementación de Autenticación - Tiendas DAKA.CA

¡Bienvenido/a a la prueba técnica! Este reto está diseñado para evaluar tus habilidades en el desarrollo de aplicaciones web full-stack utilizando Nest.js y Vue.js.

Se te proporciona un monorepo que contiene una aplicación base con la funcionalidad de registro de usuarios ya implementada y conectada.

## Objetivo del Reto

Tu misión es implementar el flujo completo de inicio de sesión (login) en la aplicación. Deberás desarrollar tanto la lógica en el backend para validar credenciales y generar tokens, como la interfaz en el frontend para que los usuarios puedan iniciar sesión y acceder a una ruta protegida.

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

## Criterios de Evaluación

- **Funcionalidad**: El flujo completo de login y acceso a rutas protegidas debe funcionar como se espera.
- **Calidad del Código**: Se valorará un código limpio, legible, bien estructurado y que siga las buenas prácticas de cada framework.
- **Seguridad**: Correcta implementación de la comparación de contraseñas y del uso de JWT para proteger rutas.
- **Manejo de Errores**: La aplicación debe gestionar correctamente tanto los casos de éxito como los de error (ej. credenciales incorrectas, token inválido).

¡Mucha suerte!