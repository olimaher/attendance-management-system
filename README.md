# 🎓 Sistema de Gestión de Asistencia Estudiantil

Sistema modular completo para el registro y seguimiento de asistencia de estudiantes de educación básica primaria.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)

---

## ✨ Características Principales

- ✅ **Dashboard Interactivo** con estadísticas en tiempo real
- 👥 **Gestión de Estudiantes** (CRUD completo con 7 grados: Jardín a Quinto)
- 📝 **Toma Rápida de Asistencia** con avance automático
- 📊 **Reportes Completos:**
  - Gráficos de asistencia por grado
  - Alertas semanales (2+ ausencias por semana)
  - Alertas mensuales (3+ ausencias por mes)
  - Exportación a CSV
- 💾 **Persistencia de Datos** con Docker Volumes
- 🚀 **100% Dockerizado** - Funciona en cualquier PC

---

## 🚀 Instalación Rápida

Ver [INSTALL.md](INSTALL.md) para instrucciones completas.
```bash
git clone https://github.com/TU-USUARIO/attendance-management-system.git
cd attendance-management-system
chmod +x start.sh
./start.sh
```

Accede a: http://localhost:3000

---

## 🛠️ Stack Tecnológico

### Frontend
- React 18 + Vite
- React Router v6
- Recharts (gráficos)
- TailwindCSS
- Axios

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL 15

### DevOps
- Docker + Docker Compose
- WSL2 (Ubuntu)

## 📋 Requisitos Previos

- WSL2 con Ubuntu
- Docker Desktop para Windows
- Node.js 18+ (se instalará en los contenedores)
- Git

## 🏗️ Estructura del Proyecto
```
attendance-management-system/
├── frontend/          # Aplicación React
├── backend/           # API REST con Express
├── database/          # Scripts SQL e inicialización
├── docs/              # Documentación adicional
├── docker-compose.yml # Orquestación de servicios
└── start.sh           # Script de inicio
```

## 🚀 Instalación y Uso

### Primera vez (Setup)
```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd attendance-management-system

# Dar permisos al script de inicio
chmod +x start.sh

# Iniciar el sistema
./start.sh
```

### Uso diario
```bash
# Iniciar
./start.sh

# Detener
docker-compose down
```

### Acceso a la aplicación

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000
- **Base de datos:** localhost:5432

## 📖 Documentación

Ver carpeta `docs/` para documentación detallada:
- Arquitectura del sistema
- Guía de desarrollo
- Esquema de base de datos

## 🤝 Contribución

Este es un proyecto educativo. Para sugerencias o mejoras, crear un issue.

## 📝 Licencia

MIT License

## 👨‍💻 Autor

[Olimpo Macea] - [https://github.com/olimpoMacea/attendance-management-system.git]

---

**Versión:** 1.0.0  
**Estado:** En desarrollo
