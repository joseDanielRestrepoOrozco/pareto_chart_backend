# Pareto Chart Backend

Backend API para la aplicación de Diagrama de Pareto.

## 🚀 Configuración del Entorno

### 1. Clona el repositorio
```bash
git clone <repository-url>
cd pareto/backend
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
- **MONGODB_URI**: URL de conexión a MongoDB
  - Para desarrollo local: `mongodb://localhost:27017/pareto_diagram`
  - Para MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/`

#### Seguridad
- **SECRET**: Clave secreta para JWT (mínimo 64 caracteres)
  - Generar con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

#### Email (opcional)
- **EMAIL_SERVICE**: Servicio de email (ej: gmail)
- **EMAIL_USER**: Tu dirección de email
- **EMAIL_PASS**: Contraseña de aplicación (no tu contraseña normal)

### 5. Ejecuta la aplicación
```bash
# Desarrollo
pnpm run dev

# Producción
pnpm start
```

## 🔒 Seguridad

- ✅ Autenticación JWT implementada
- ✅ Validación de propiedad de recursos
- ✅ Middleware de autorización
- ✅ Variables de entorno para información sensible

## 📁 Estructura del Proyecto

```
src/
├── controllers/     # Controladores de las rutas
├── middlewares/     # Middlewares personalizados
├── models/         # Modelos de MongoDB
├── routes/         # Definición de rutas
├── schemas/        # Esquemas de validación
└── libs/           # Utilidades y librerías
```

## 🚨 Importante

- **NUNCA** subas tu archivo `.env` al repositorio
- **SIEMPRE** usa contraseñas seguras y claves JWT largas
- **VERIFICA** que `.env` esté en tu `.gitignore`

## 📋 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Proyectos
- `GET /api/projects` - Obtener proyectos del usuario
- `POST /api/projects` - Crear nuevo proyecto
- `GET /api/projects/:id` - Obtener proyecto específico
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Problemas
- `POST /api/projects/:id/problems` - Agregar problema al proyecto
- `PUT /api/projects/:id/problems/:problemId` - Actualizar problema
- `DELETE /api/projects/:id/problems/:problemId` - Eliminar problema
