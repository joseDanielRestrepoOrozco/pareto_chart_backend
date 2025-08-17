# Pareto Chart Backend

Backend API para la aplicación de Diagrama de Pareto de la universidad de Caldas.

## 🚀 Configuración del Entorno

### 1. Clona el repositorio
```bash
git clone https://github.com/joseDanielRestrepoOrozco/pareto_chart_backend.git
cd pareto_chart_backend
```

### 2. Instala las dependencias
```bash
pnpm install
```

### 3. Configura las variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env con tus valores reales
nano .env  # o usa tu editor preferido
```

### 4. Configuración de variables de entorno requeridas

#### Base de Datos MongoDB
- MONGODB_URI: URL de conexión a MongoDB
  - Para desarrollo local: mongodb://localhost:27017/pareto_diagram
  - Para MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/

#### Seguridad
- SECRET: Clave secreta para JWT (mínimo 64 caracteres)
  - Generar con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

#### Email (para verificación y 2FA por correo)
- EMAIL_SERVICE: Servicio de email (ej: gmail)
- EMAIL_USER: Dirección de email remitente
- EMAIL_PASS: Contraseña de aplicación (no tu contraseña normal)

#### Frontend (para link de restablecimiento)
- FRONTEND_URL: URL base del frontend (por defecto http://localhost:5713)

### 5. Ejecuta la aplicación
```bash
# Desarrollo
pnpm run dev

# Producción
pnpm start
```

---

## 🧑‍💻 Tutoriales de Uso

Base URL (dev): http://localhost:3000

### 1) Registro con verificación por correo

1. Crear cuenta
- Method: POST
- URL: /api/auth/register
- Headers:
  - Content-Type: application/json
- Body (JSON):
  {
    "username": "usuario1",
    "email": "usuario1@ejemplo.com",
    "password": "P@ssw0rd!"
  }
- Response 201 (JSON):
  {
    "id": "665c...",
    "username": "usuario1",
    "email": "usuario1@ejemplo.com"
  }

2. Revisa tu correo y copia el código de verificación (6 dígitos, expira en ~30 min)

3. Confirmar código y activar cuenta
- Method: POST
- URL: /api/auth/verifyCode
- Headers:
  - Content-Type: application/json
- Body (JSON):
  {
    "email": "usuario1@ejemplo.com",
    "code": "123456"
  }
- Response 200 (JSON):
  {
    "message": "verification successful",
    "token": "<JWT>"
  }

Usa Authorization: Bearer <JWT> en endpoints protegidos.

### 2) Login con segundo factor (código por correo)

1. Enviar credenciales
- Method: POST
- URL: /api/auth/login
- Headers:
  - Content-Type: application/json
- Body (JSON):
  {
    "email": "usuario1@ejemplo.com",
    "password": "P@ssw0rd!"
  }
- Response 200 (JSON):
  {
    "id": "665c...",
    "username": "usuario1",
    "email": "usuario1@ejemplo.com"
  }
- Nota: Se envía un código de 6 dígitos al correo (expira en ~15 min). Aún no hay token.

2. Confirmar segundo factor
- Method: POST
- URL: /api/auth/secondFactorAuthentication
- Headers:
  - Content-Type: application/json
- Body (JSON):
  {
    "email": "usuario1@ejemplo.com",
    "code": "654321"
  }
- Response 200 (JSON):
  {
    "message": "Login successful",
    "token": "<JWT>"
  }

3. (Opcional) Verificar/renovar token
- Method: POST
- URL: /api/auth/verify
- Headers:
  - Content-Type: application/json
- Body (JSON):
  { "token": "<JWT_actual>" }
- Response 200 (JSON):
  {
    "user": { "id": "665c...", "username": "usuario1", "email": "usuario1@ejemplo.com" },
    "token": "<JWT_nuevo>"
  }

### 3) Recuperar y cambiar contraseña

1. Solicitar enlace de restablecimiento
- Method: POST
- URL: /api/auth/resetPassword
- Headers:
  - Content-Type: application/json
- Body (JSON):
  { "email": "usuario1@ejemplo.com" }
- Response 200 (JSON):
  { "message": "Reset email sent" }

2. Cambiar contraseña vía API (usando el token del enlace)
- Method: PUT
- URL: /api/auth/changeResetPassword
- Headers:
  - Content-Type: application/json
- Body (JSON):
  {
    "token": "<token_del_enlace>",
    "newPassword": "N3wP@ss!",
    "confirmNewPassword": "N3wP@ss!"
  }
- Response 200 (JSON):
  { "message": "Password reset successful" }

### 4) Crear un Proyecto
- Method: POST
- URL: /api/projects
- Headers:
  - Authorization: Bearer <JWT>
  - Content-Type: application/json
- Body (JSON):
  { "name": "Mi Proyecto" }
- Response 201 (JSON): Proyecto creado

### 5) Agregar un Problema a un Proyecto
- Method: POST
- URL: /api/problems/:projectId
- Headers:
  - Authorization: Bearer <JWT>
  - Content-Type: application/json
- Body (JSON):
  { "name": "Falla A", "frequency": 42 }
- Response 201 (JSON): Problema creado

### 6) Actualizar un Problema
- Method: PUT
- URL: /api/problems/:problemId
- Headers:
  - Authorization: Bearer <JWT>
  - Content-Type: application/json
- Body (JSON):
  { "name": "Falla A Modificada", "frequency": 50 }
- Response 200 (JSON): Problema actualizado

### 7) Obtener Análisis de Pareto
- Method: GET
- URL: /api/analysis/:projectId?threshold=80
- Headers:
  - Authorization: Bearer <JWT>
- Response 200 (JSON): Datos de análisis de Pareto

---

## 📦 Proyectos de Ejemplo

### Ejemplo de Proyecto y Problemas

1. Crear proyecto:
   - name: "Producción Planta 1"
2. Agregar problemas:
   - { name: "Falla Motor", frequency: 30 }
   - { name: "Fuga Aceite", frequency: 15 }
   - { name: "Desgaste Correa", frequency: 10 }

### Flujo típico
1. Registrar usuario con email y contraseña.
2. Revisar correo y verificar cuenta enviando { email, code } a /api/auth/verifyCode para obtener el JWT.
3. Crear proyecto usando Authorization: Bearer <JWT>.
4. Agregar varios problemas al proyecto.
5. Consultar análisis Pareto del proyecto.
6. En próximos ingresos, hacer login y confirmar el segundo factor en /api/auth/secondFactorAuthentication para obtener el JWT.

---

## 📚 Referencia de API

### Endpoints y Métodos

- Auth
  - POST /api/auth/register: Crea un usuario nuevo y envía código por email (6 dígitos).
  - POST /api/auth/verifyCode: Verifica cuenta con { email, code } y devuelve JWT.
  - POST /api/auth/login: Valida credenciales; envía código por email (2FA).
  - POST /api/auth/secondFactorAuthentication: Confirma { email, code } y devuelve JWT.
  - POST /api/auth/verify: Verifica/renueva token. Body: { token }
  - POST /api/auth/resetPassword: Envía link de restablecimiento. Body: { email }
  - PUT /api/auth/changeResetPassword: Cambia contraseña. Body: { token, newPassword, confirmNewPassword }

- Proyectos
  - POST /api/projects: Crea un proyecto. Body: { name }
  - GET /api/projects: Lista proyectos del usuario.
  - GET /api/projects/:id: Detalle de un proyecto.
  - PUT /api/projects/:id: Actualiza nombre del proyecto.
  - DELETE /api/projects/:id: Elimina el proyecto.

- Problemas
  - POST /api/problems/:projectId: Agrega problema. Body: { name, frequency }
  - PUT /api/problems/:problemId: Actualiza problema. Body: { name, frequency }
  - DELETE /api/problems/:problemId: Elimina problema.

- Análisis
  - GET /api/analysis/:projectId: Devuelve análisis Pareto. Query opcional: threshold (ej. 80)

---

## 🏗️ Documentación de Arquitectura

### Estructura de carpetas
```
src/
├── controllers/     # Lógica de negocio y endpoints
├── middlewares/     # Middlewares de Express (auth, validación, errores)
├── models/          # Modelos de Mongoose (User, Project, Problem)
├── routes/          # Definición de rutas Express
├── schemas/         # Esquemas de validación Zod
└── libs/            # Utilidades (logger, JWT, email, pareto)
```

### Flujo de datos
1. El usuario se autentica y obtiene un JWT.
2. Todas las operaciones protegidas requieren el header `Authorization: Bearer <token>`.
3. El usuario crea proyectos y problemas asociados.
4. El endpoint de análisis calcula y retorna los datos de Pareto a partir de los problemas del proyecto.

### Dependencias clave
- Express: Framework principal de servidor.
- Mongoose: ODM para MongoDB.
- Zod: Validación de datos de entrada.
- jsonwebtoken: Manejo de JWT.
- nodemailer: Envío de emails (opcional).
- dotenv: Manejo de variables de entorno.

Nota: Para que lleguen los códigos por correo, configura EMAIL_SERVICE, EMAIL_USER y EMAIL_PASS en .env.

---

## 📐 Objetos principales

- Proyecto
  - id: string
  - name: string
  - problems: Problem[]
  - user: string

- Problema
  - id: string
  - name: string
  - frequency: number
  - project: string

- Respuesta de análisis Pareto
  - data: Array<{ category, frequency, percentage, cumulative, cumulativeFrequency, cumulativePercentage, isCritical }>
  - totalFrequency: number
  - totalCategories: number
  - topCause: string
  - threshold: number
