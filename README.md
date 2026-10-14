# API de autenticación con Node.js + TypeScript

API REST con registro, login, JWT, validación de email por correo y gestión de categorías protegida con token.
Usa Express, MongoDB (Mongoose), bcrypt y Nodemailer.

## Requisitos

- Node.js 18 o superior
- Docker (para levantar MongoDB)
- Una cuenta de Gmail con **contraseña de aplicación** (para enviar correos)

## Puesta en marcha rápida

1. Clona el repositorio e instala las dependencias:

   ```bash
   git clone git@github.com:Juanfull10/authenticacion_nodejs.git
   cd authenticacion_nodejs
   npm install
   ```

2. Copia la plantilla de variables de entorno:

   ```bash
   cp .env.template .env
   ```

3. Edita `.env` y completa los valores (ver tabla abajo).

4. Levanta MongoDB:

   ```bash
   docker compose up -d
   ```

5. Arranca el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

El servidor queda en `http://localhost:3000`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `MONGO_URL` | Conexión a Mongo (usuario y contraseña del `docker-compose.yml`) | `mongodb://mongo-user:123456@localhost:27017` |
| `MONGO_DB_NAME` | Nombre de la base de datos | `mystore` |
| `JWT_SEED` | Clave secreta para firmar los tokens | una frase larga y propia |
| `MAILER_SERVICE` | Servicio de correo | `gmail` |
| `MAILER_EMAIL` | Correo que envía los mensajes | `tucorreo@gmail.com` |
| `MAILER_SECRET_KEY` | Contraseña de aplicación de Gmail | (16 caracteres) |
| `WEBSERVICE_URL` | URL base de la API, usada en el enlace del correo | `http://localhost:3000/api` |

## Endpoints

### Autenticación

Base: `http://localhost:3000/api/auth`

| Método | Ruta | Body (JSON) | Descripción |
|---|---|---|---|
| POST | `/register` | `name`, `email`, `password` | Crea el usuario y envía el correo de validación |
| POST | `/login` | `email`, `password` | Devuelve el usuario y un token JWT |
| GET | `/validate-email/:token` | — | Valida el email (el enlace llega al correo) |

La contraseña debe tener al menos 6 caracteres.

### Categorías

Base: `http://localhost:3000/api/categories`

| Método | Ruta | Auth | Body (JSON) | Descripción |
|---|---|---|---|---|
| GET | `/` | No | — | Lista las categorías *(en desarrollo)* |
| POST | `/` | **Sí** | `name`, `available` (opcional) | Crea una categoría ligada al usuario del token |

Las rutas protegidas requieren el token que devuelve `/login`, en la cabecera `Authorization: Bearer <tu_token>`.

## Probar la API

1. `POST /api/auth/register` con `name`, `email` y `password`.
2. Abre el correo de validación y pulsa el enlace. Para abrirlo desde otro dispositivo, usa un túnel (por ejemplo ngrok) y pon su URL en `WEBSERVICE_URL`.
3. `POST /api/auth/login` y copia el `token` de la respuesta.
4. `POST /api/categories` con la cabecera `Authorization: Bearer <token>` y un body como `{"name": "Ropa", "available": true}`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo, con recarga automática |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Compila y ejecuta la versión de producción |

## Problemas frecuentes

- **`Authentication failed` al conectar con Mongo:** revisa que `MONGO_URL` tenga el formato `usuario:contraseña@host`. Si cambiaste las credenciales del `docker-compose.yml`, borra la carpeta `mongo/` y vuelve a levantar el contenedor.
- **`EADDRINUSE ... :3000`:** ya hay otra copia de la app usando el puerto. Ciérrala con `Ctrl+C`.
- **`No token provider` (401):** falta la cabecera `Authorization: Bearer <token>` en una ruta protegida.
