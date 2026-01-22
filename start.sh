#!/usr/bin/env bash

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "======================================"
echo "  Sistema de Gestión de Asistencia"
echo "======================================"
echo ""

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker no está corriendo${NC}"
    echo ""
    echo "Por favor inicia Docker Desktop o el servicio de Docker:"
    echo "  sudo systemctl start docker"
    exit 1
fi

# Verificar si PostgreSQL local está corriendo en puerto 5432
if sudo lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  PostgreSQL local está usando el puerto 5432${NC}"
    echo ""
    echo "Deteniendo PostgreSQL local..."
    sudo systemctl stop postgresql
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PostgreSQL local detenido${NC}"
    else
        echo -e "${RED}❌ No se pudo detener PostgreSQL local${NC}"
        echo "Ejecuta manualmente: sudo systemctl stop postgresql"
        exit 1
    fi
    echo ""
fi

# Construir e iniciar contenedores
echo -e "${YELLOW}📦 Construyendo e iniciando contenedores...${NC}"
echo ""
docker compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Sistema iniciado correctamente!${NC}"
    echo ""
    echo "======================================"
    echo "  Acceso a los servicios:"
    echo "======================================"
    echo -e "📱 Frontend:  ${GREEN}http://localhost:3000${NC}"
    echo -e "🔌 API:       ${GREEN}http://localhost:5000${NC}"
    echo -e "🗄️  Base de datos: ${GREEN}localhost:5432${NC}"
    echo "   Usuario:   postgres"
    echo "   Password:  postgres123"
    echo "   Database:  attendance_db"
    echo ""
    echo "======================================"
    echo ""
    echo "Para ver logs:     docker compose logs -f"
    echo "Para detener:      docker compose down"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Error al iniciar el sistema${NC}"
    echo ""
    echo "Para ver detalles del error:"
    echo "  docker compose logs"
    exit 1
fi
