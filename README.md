# Salus Laboris — Frontend

Aplicación administrativa en Angular 20 para el Sistema Web de Salud Ocupacional Salus Laboris.

## Funcionalidades incluidas

- Inicio de sesión con JWT.
- Interceptor HTTP y protección de rutas.
- Menú dinámico según páginas asignadas al rol.
- Dashboard responsive.
- Listado paginado de personas.
- Registro, edición, activación y desactivación de personas.
- Manejo visual de errores 401, 403 y validaciones del backend.

## Requisitos

- Node.js compatible con Angular 20.
- Backend ejecutándose en `http://localhost:8080`.

## Ejecución

```bash
npm install
npm start
```

Abrir `http://localhost:4200`.

## Estructura

```text
src/app/
├── core/       # autenticación, interceptor, guards y modelos
├── features/   # login, dashboard y módulos funcionales
└── layout/     # navegación administrativa
```

La API se configura actualmente en `src/app/core/auth.service.ts` mediante `API_URL`.
