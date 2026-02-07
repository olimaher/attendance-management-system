# 📦 Guía de Instalación - Sistema de Gestión de Asistencia

## ⚙️ Requisitos Previos

### En la computadora donde se instalará:

1. **WSL2 con Ubuntu** (solo Windows)
   - Abrir PowerShell como administrador:
```powershell
   wsl --install
```
   - Reiniciar el PC
   - Abrir Ubuntu y crear usuario

2. **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
   - Windows/Mac: Descargar de https://www.docker.com/products/docker-desktop
   - Habilitar integración con WSL2 (Settings → Resources → WSL Integration)

3. **Git**
```bash
   sudo apt update
   sudo apt install git -y
```

---

## 🚀 Instalación

### Paso 1: Clonar el repositorio
```bash
# Crear carpeta de proyectos
mkdir -p ~/proyectos
cd ~/proyectos

# Clonar
git clone https://github.com/TU-USUARIO/attendance-management-system.git

# Entrar al proyecto
cd attendance-management-system
```

---

### Paso 2: Dar permisos al script de inicio
```bash
chmod +x start.sh
```

---

### Paso 3: Detener PostgreSQL local (si existe)
```bash
# Solo si tienes PostgreSQL instalado localmente
sudo systemctl stop postgresql
```

---

### Paso 4: Iniciar el sistema
```bash
./start.sh
```

**Espera 1-2 minutos mientras:**
- Descarga las imágenes de Docker
- Construye los contenedores
- Inicializa la base de datos

---

### Paso 5: Acceder al sistema

**Abre tu navegador en:**
- 🌐 **Frontend:** http://localhost:3000
- 🔌 **API:** http://localhost:5000

---

## 🛑 Detener el Sistema
```bash
docker-compose down
```

---

## 🔄 Actualizar el Sistema
```bash
cd ~/proyectos/attendance-management-system

# Descargar últimos cambios
git pull

# Reconstruir contenedores
docker-compose down
docker-compose up --build -d
```

---

## 🗄️ Gestión de Datos

### Hacer Backup de la Base de Datos
```bash
docker exec -t attendance_db pg_dump -U postgres attendance_db > backup_$(date +%Y%m%d).sql
```

### Restaurar Backup
```bash
docker exec -i attendance_db psql -U postgres attendance_db < backup_YYYYMMDD.sql
```

### Borrar TODOS los Datos
```bash
docker-compose down -v  # ⚠️ Esto borra TODO, incluida la base de datos
```

---

## 🔧 Solución de Problemas

### Docker no inicia
```bash
# Ver si Docker está corriendo
docker ps

# Si no, iniciar Docker Desktop (Windows/Mac)
# O en Linux:
sudo systemctl start docker
```

### Puerto 5432 ocupado
```bash
# Detener PostgreSQL local
sudo systemctl stop postgresql

# Reiniciar el sistema
./start.sh
```

### Ver logs de errores
```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs solo del backend
docker-compose logs -f backend

# Logs solo del frontend
docker-compose logs -f frontend
```

---

## 📱 Acceso desde Otros Dispositivos

Para acceder desde otros dispositivos en la misma red:

1. Obtén tu IP local:
```bash
   hostname -I
```

2. Desde otro dispositivo, accede a:
```
   http://TU_IP:3000
```

---

## 👥 Soporte

Para problemas o sugerencias, crear un issue en:
https://github.com/TU-USUARIO/attendance-management-system/issues
