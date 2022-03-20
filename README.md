# Gestor De Proyectos

Este es un proyecto escolar de la materia de Proyectos "I+D"

## Backend

El backend será desarrollado en forma de rest api para su consumo por el frontend.

### Configuración

#### Base de datos

Para evitar la creación manual de la base de datos se hará uso de sequelize y un servidor de MySql (de preferencia utilizar XAMPP).

1. Iniciar el servidor MySql
2. Crear una base de datos (se sugiere el nombre proyectos_escolares)
3. Descomentar la linea "SINCRONIZAR BASE DE DATOS" del archivo /src/models/alumno.js
4. Ejecutar el servidor (npm run dev), de esta manera todos los modelos serán creados en la base de datos
5. Una vez que todos las tablas hayan sido creadas, comentar la linea "SINCRONIZAR BASE DE DATOS" nuevamente
6. Poblar la base de datos con los datos de pruebla del archivo "data.sql" (se sugiere usar la interfaz phpMyAdmin)

#### Archivo .env

Se requiere un archivo .env para trabajar; las variables requeridas son las siguientes:

- NODE_ENV -> ambiente (production | development)
- HOST -> url del servidor que alojará la api rest (localhost | ip_address)
- DB_NAME -> Nombre de la base de datos MySQL a la cual se va a conectar (se sugiere el nombre proyectos_escolares)
- DB_USER -> Usuario de la conexión MySQL
- DB_PASSWORD -> Contraseña de la conexión MySQL
- DB_HOST -> Url de la conexión MySQL (localhost | ipaddress)

Ejemplo del archivo **.env**:

- NODE_ENV=development
- HOST=http://localhost
- DB_NAME=proyectos_escolares
- DB_USER=root
- DB_PASSWORD=''
- DB_HOST=localhost

### Ejecución del servidor

1. Abrir una consola
2. cd backend/
3. npm run dev

### Consumo de la API REST

La ruta para desarrollo, por defecto, es http://localhost:3300/api/v1/. Las rutas definidas y los verbos se encuentran en src/routes/index.js.

Ejemplos de consumo:

GET http://localhost:3300/api/v1/alumnos

GET http://localhost:3300/api/v1/alumnos/201749575

POST http://localhost:3300/api/v1/alumnos
Content-Type: application/json

```json
{
  "nombre": "Luis Arturo",
  "paterno": "Tenorio",
  "materno": "Lopez",
  "sexo": "h",
  "email": "arturo@alumno.com",
  "contrasena": "arturo123",
  "rol": "ALUMNO",
  "matricula": 201749575,
  "id_carrera": 1252
}
```

PUT http://localhost:3300/api/v1/alumnos/201749575
Content-Type: application/json

```json
{
  "nombre": "Luis Arturo",
  "paterno": "Tenorio",
  "materno": "Lopez",
  "sexo": "h",
  "id_carrera": 1251
}
```

DELETE http://localhost:3300/api/v1/alumnos/201749575
