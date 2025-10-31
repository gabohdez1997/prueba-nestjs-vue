# 🚀 Sistema de Autenticación JWT con WebSockets y Pokémon Sprites

Aplicación Full-Stack con NestJS y Vue.js que implementa autenticación JWT, rutas protegidas y comunicación en tiempo real mediante WebSockets para gestionar sprites de Pokémon.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Variables de Entorno](#variables-de-entorno)

## ✨ Características

### Autenticación (Obligatorio)
- ✅ Sistema completo de login con JWT
- ✅ Validación de credenciales con bcrypt
- ✅ Rutas protegidas con Guards
- ✅ Manejo de tokens en el frontend
- ✅ Navigation guards en Vue Router
- ✅ Perfil de usuario protegido

### Sprites de Pokémon (Adicional)
- ✅ WebSocket Gateway con autenticación JWT
- ✅ Descarga de sprites desde PokeAPI
- ✅ Galería de sprites en tiempo real
- ✅ Gestión de sprites (agregar/eliminar)
- ✅ Persistencia de sprites por usuario

## 🛠 Tecnologías

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación con tokens
- **bcrypt** - Hash de contraseñas
- **@nestjs/websockets** - WebSockets
- **socket.io** - Comunicación en tiempo real
- **axios** - Cliente HTTP

### Frontend
- **Vue.js 3** - Framework frontend
- **Vue Router** - Enrutamiento
- **Pinia** - State management
- **Axios** - Cliente HTTP
- **Socket.io-client** - WebSocket client
- **Tailwind CSS** - Estilos

### DevOps
- **Docker** - Contenedores
- **Docker Compose** - Orquestación

## 🏗 Arquitectura

```
┌─────────────┐         ┌──────────────────┐
│   Client    │ ◄─────► │   Nest App       │
│  (Vue.js)   │  HTTP   │                  │
└─────────────┘         └──────────────────┘
       │                         │
       │                         │
       │ WebSocket               │ TypeORM
       │                         │
       ▼                         ▼
┌─────────────┐         ┌──────────────────┐
│  Socket.io  │ ◄─────► │   PostgreSQL     │
└─────────────┘         └──────────────────┘
```

### Flujo de Autenticación

1. **POST /auth/login** - Usuario envía credenciales
2. **Validación** - Backend verifica en BD con bcrypt
3. **JWT Generation** - Se genera token con userId y username
4. **Response** - Se devuelve accessToken
5. **GET /auth/me** - Cliente solicita datos con token en header
6. **Validation** - Guard valida el JWT
7. **Response** - Se devuelven datos del usuario

## 📦 Requisitos Previos

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 18 (solo para desarrollo local)

## 🚀 Instalación y Ejecución

### Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd project-root

# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Base de Datos**: localhost:5432

### Desarrollo Local

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
project-root/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── decorators/
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── login-response.dto.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── ws-jwt.guard.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── users/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── pokemon/
│   │   │   ├── entities/
│   │   │   │   └── sprite.entity.ts
│   │   │   ├── pokemon.gateway.ts
│   │   │   ├── pokemon.service.ts
│   │   │   └── pokemon.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.vue
│   │   │   ├── ProfileView.vue
│   │   │   └── SpriteGallery.vue
│   │   ├── stores/
│   │   │   └── auth.ts
│   │   ├── router/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── socket.ts
│   │   ├── App.vue
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Autenticación

#### POST /auth/login
Inicia sesión y retorna un JWT.

**Request:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "usuario"
  }
}
```

**Errores:**
- `401 Unauthorized` - Credenciales inválidas

#### GET /auth/me
Obtiene información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "id": 1,
  "username": "usuario"
}
```

**Errores:**
- `401 Unauthorized` - Token inválido o ausente

## 🔌 WebSocket Events

### Conexión
```javascript
// Cliente se conecta con token
socket.auth = { token: accessToken };
socket.connect();
```

### get-pokemon-sprite
Solicita un sprite aleatorio de Pokémon.

**Emit:**
```javascript
socket.emit('get-pokemon-sprite');
```

**Listen:**
```javascript
socket.on('pokemon-sprite', (data) => {
  // data: { id, pokemonId, name, spriteUrl, userId }
});
```

### delete-sprite
Elimina un sprite de la galería.

**Emit:**
```javascript
socket.emit('delete-sprite', { spriteId: 123 });
```

**Listen:**
```javascript
socket.on('sprite-deleted', (data) => {
  // data: { id }
});
```

### user-sprites
Recibe todos los sprites del usuario al conectarse.

**Listen:**
```javascript
socket.on('user-sprites', (sprites) => {
  // sprites: Array<{ id, pokemonId, name, spriteUrl }>
});
```

### Errores
```javascript
socket.on('error', (error) => {
  console.error(error.message);
});
```

## 🔐 Variables de Entorno

### Backend (.env)
```env
# Base de datos
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=pokemon_auth

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Aplicación
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

## 👤 Usuario de Prueba

Para facilitar las pruebas, la aplicación crea automáticamente un usuario:

```
Username: admin
Password: admin123
```

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend
```bash
cd frontend
npm run test:unit
```

## 📝 Notas de Seguridad

- Las contraseñas se hashean con bcrypt (10 rounds)
- Los JWT expiran en 24 horas (configurable)
- Las rutas protegidas requieren token válido
- Los WebSockets validan JWT en la conexión
- Nunca commitear el archivo `.env` con secretos reales

## 🐛 Troubleshooting

### La base de datos no se conecta
```bash
docker-compose down -v
docker-compose up -d
```

### El frontend no conecta al backend
Verifica las variables de entorno en `frontend/.env`

### Error de CORS
Asegúrate que el backend tenga habilitado CORS para el origen del frontend

## 📄 Licencia

MIT
