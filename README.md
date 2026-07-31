# 🛠️ FullStack Backend
 
API REST para gestión de usuarios con autenticación JWT, control de roles y monitoreo de seguridad, construida con **Node.js**, **Express 5** y **MongoDB**.
 
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-black?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
 
---
 
## 📋 Índice
 
- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Scripts disponibles](#-scripts-disponibles)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Roles y permisos](#-roles-y-permisos)
- [Seguridad](#-seguridad)
- [Autor](#-autor)
---
 
## 📖 Descripción
 
Backend de una aplicación de gestión de usuarios que expone una API REST con autenticación basada en **JWT**, control de acceso por **roles** (`ROOT`, `ADMIN`, `USER`, `GUEST`), y un conjunto de mecanismos de seguridad como límite de solicitudes, protección contra fuerza bruta y registro de eventos sospechosos.
 
## ✨ Características
 
- 🔐 Autenticación con JWT y contraseñas hasheadas con `bcryptjs`.
- 👥 CRUD de usuarios con control de acceso por rol.
- 🛡️ Middleware de protección contra ataques de fuerza bruta en el login.
- 🚦 Rate limiting global de solicitudes.
- 📝 Registro de eventos de seguridad (`SecurityLog`) y auditoría de eliminación de usuarios (`Audit`).
- ✅ Validación de datos de entrada con `Joi`.
- 📧 Envío de emails (solicitudes de edición de datos) vía `Resend`.
- 🌐 CORS configurado con lista blanca de orígenes permitidos.
## 🧰 Tecnologías
 
| Tecnología | Uso |
|---|---|
| Node.js + Express 5 | Servidor y enrutamiento |
| MongoDB + Mongoose | Base de datos y modelado |
| JSON Web Token | Autenticación |
| bcryptjs | Hasheo de contraseñas |
| Joi | Validación de esquemas |
| express-rate-limit | Límite global de requests |
| rate-limiter-flexible | Protección anti fuerza bruta |
| Resend | Envío de correos |
| dotenv | Manejo de variables de entorno |
| nodemon | Recarga en desarrollo |
 
## 📂 Estructura del proyecto
 
```
FullStack_backend/
├── src/
│   ├── app.js                     # Punto de entrada del servidor
│   ├── config/
│   │   ├── cors.js                # Configuración de CORS
│   │   ├── db.js                  # Conexión a MongoDB
│   │   └── env.js                 # Validación de variables de entorno
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── dto/
│   │   └── user.dto.js            # Esquemas de validación (Joi)
│   ├── helpers/
│   │   └── response.helper.js     # Formato estándar de respuestas
│   ├── middlewares/
│   │   ├── auth.middleware.js     # Verificación de JWT
│   │   ├── bruteForce.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── role.middleware.js     # Autorización por rol
│   ├── models/
│   │   ├── audit.model.js
│   │   ├── securityLog.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   └── services/
│       ├── auth.service.js
│       ├── mail.service.js
│       └── user.service.js
├── scripts/
│   └── test-security.js
├── package.json
└── .env
```
 
## ⚙️ Instalación
 
```bash
# Clonar el repositorio
git clone https://github.com/aleojeda8/FullStack_backend.git
cd FullStack_backend
 
# Instalar dependencias
npm install
 
# Crear archivo .env (ver sección de variables de entorno)
cp .env.example .env
 
# Levantar en modo desarrollo
npm run dev
```
 
## 🔑 Variables de entorno
 
Crear un archivo `.env` en la raíz del proyecto con las siguientes claves:
 
| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde corre el servidor |
| `MONGO_URI` | Cadena de conexión a MongoDB |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej. `1h`) |
| `FRONTEND_URLS` | Orígenes permitidos por CORS, separados por coma |
| `RESEND_API_KEY` | API Key de Resend para el envío de emails |
| `RATE_LIMIT_WINDOW_MINUTES` | Ventana de tiempo para el rate limit global |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de solicitudes permitidas en la ventana |
| `LOGIN_WINDOW_MINUTES` | Ventana de tiempo para el control anti fuerza bruta |
| `LOGIN_MAX_ATTEMPTS` | Intentos de login permitidos antes de bloquear |
| `LOGIN_BLOCK_MINUTES` | Minutos de bloqueo tras exceder los intentos |
 
> ⚠️ El archivo `.env` nunca debe subirse al repositorio (ya está incluido en `.gitignore`).
 
## 📜 Scripts disponibles
 
| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor con recarga automática (nodemon) |
| `npm start` | Levanta el servidor en modo producción |
| `npm run test:security` | Corre el script de pruebas de seguridad |
 
## 🔌 Endpoints de la API
 
### Autenticación
 
| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| `POST` | `/auth/login` | Inicia sesión y devuelve un token JWT | No (con anti fuerza bruta) |
 
### Usuarios
 
| Método | Ruta | Descripción | Roles permitidos |
|---|---|---|---|
| `GET` | `/users` | Lista/busca usuarios (por `id` o `email`) | ROOT, ADMIN, USER, GUEST |
| `POST` | `/users` | Crea un nuevo usuario | ROOT, ADMIN |
| `PUT` | `/users/:id` | Actualiza un usuario existente | ROOT, ADMIN |
| `DELETE` | `/users/:id` | Elimina un usuario (con auditoría) | ROOT, ADMIN |
| `POST` | `/users/request-edit` | Solicita edición de datos propios (envía email) | Cualquier usuario autenticado |
 
Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```
 
## 👤 Roles y permisos
 
| Rol | Descripción |
|---|---|
| `ROOT` | Acceso total, único que puede eliminar a otros `ADMIN` o `ROOT` |
| `ADMIN` | Gestiona usuarios `USER` y `GUEST`, no puede ver/eliminar `ROOT` |
| `USER` | Acceso limitado a su propia información y la de otros `USER`/`GUEST` |
| `GUEST` | Acceso restringido, solo a su propio perfil |
 
## 🛡️ Seguridad
 
- Contraseñas hasheadas con `bcryptjs` (10 salt rounds).
- Tokens JWT firmados con expiración configurable.
- Middleware de **rate limiting** global sobre todas las rutas.
- Middleware de **anti fuerza bruta** específico para el login (bloqueo temporal por IP + email).
- Registro de eventos sospechosos en la colección `SecurityLog`.
- Auditoría de bajas de usuarios en la colección `Audit`, dentro de una transacción de MongoDB.
- CORS restringido a una lista blanca de orígenes (`FRONTEND_URLS`).

## 👨‍💻 Autor: Alejandro Ojeda
 
Repositorio al FrontEnd: (https://github.com/aleojeda8/FullStack_FrontEnd.git)
