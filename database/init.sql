-- ================================================
-- Sistema de Gestión de Asistencia Estudiantil
-- Script de Inicialización de Base de Datos
-- ================================================

-- Eliminar tablas si existen (para desarrollo)
DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS grades CASCADE;

-- ================================================
-- TABLA CATÁLOGO: grades
-- Almacena los grados disponibles en la institución
-- ================================================
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    display_order INTEGER NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_grades_active ON grades(active);
CREATE INDEX idx_grades_display_order ON grades(display_order);

COMMENT ON TABLE grades IS 'Catálogo de grados académicos';
COMMENT ON COLUMN grades.code IS 'Código único del grado (ej: JARDIN, PRIM)';
COMMENT ON COLUMN grades.name IS 'Nombre legible del grado (ej: Jardín, Primero)';
COMMENT ON COLUMN grades.display_order IS 'Orden de presentación en la UI';

-- ================================================
-- DATOS INICIALES: Grados
-- ================================================
INSERT INTO grades (code, name, display_order, description) VALUES
    ('JARDIN', 'Jardín', 1, 'Educación preescolar - Jardín'),
    ('TRANS', 'Transición', 2, 'Educación preescolar - Transición'),
    ('PRIM', 'Primero', 3, 'Educación básica primaria - Grado 1°'),
    ('SEG', 'Segundo', 4, 'Educación básica primaria - Grado 2°'),
    ('TERC', 'Tercero', 5, 'Educación básica primaria - Grado 3°'),
    ('CUART', 'Cuarto', 6, 'Educación básica primaria - Grado 4°'),
    ('QUINT', 'Quinto', 7, 'Educación básica primaria - Grado 5°');

-- ================================================
-- TABLA: students
-- Almacena información de los estudiantes
-- ================================================
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE RESTRICT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX idx_students_grade_id ON students(grade_id);
CREATE INDEX idx_students_active ON students(active);

COMMENT ON TABLE students IS 'Registro de estudiantes';
COMMENT ON COLUMN students.grade_id IS 'Referencia al grado del estudiante';
COMMENT ON COLUMN students.active IS 'Indica si el estudiante está activo (no graduado/retirado)';

-- ================================================
-- TABLA: attendances
-- Almacena registros diarios de asistencia
-- ================================================
CREATE TABLE attendances (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent')),
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

-- Índices para optimizar consultas de reportes
CREATE INDEX idx_attendances_date ON attendances(date);
CREATE INDEX idx_attendances_student_id ON attendances(student_id);
CREATE INDEX idx_attendances_status ON attendances(status);
CREATE INDEX idx_attendances_student_date ON attendances(student_id, date);

COMMENT ON TABLE attendances IS 'Registro diario de asistencia de estudiantes';
COMMENT ON COLUMN attendances.status IS 'Estado: present (presente) o absent (ausente)';
COMMENT ON COLUMN attendances.notes IS 'Notas adicionales (ej: justificación de ausencia)';

-- ================================================
-- FUNCIONES: Triggers para actualizar updated_at
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON attendances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- VISTA: student_details
-- Vista desnormalizada para consultas frecuentes
-- ================================================
CREATE OR REPLACE VIEW student_details AS
SELECT 
    s.id,
    s.name,
    s.active,
    g.id as grade_id,
    g.code as grade_code,
    g.name as grade_name,
    g.display_order as grade_order,
    s.created_at,
    s.updated_at
FROM students s
JOIN grades g ON s.grade_id = g.id;

COMMENT ON VIEW student_details IS 'Vista con información completa del estudiante incluyendo grado';

-- ================================================
-- DATOS DE PRUEBA (Para desarrollo)
-- ================================================

-- Obtener IDs de grados
DO $$
DECLARE
    jardin_id INT;
    trans_id INT;
    prim_id INT;
    seg_id INT;
    terc_id INT;
    cuart_id INT;
    quint_id INT;
BEGIN
    SELECT id INTO jardin_id FROM grades WHERE code = 'JARDIN';
    SELECT id INTO trans_id FROM grades WHERE code = 'TRANS';
    SELECT id INTO prim_id FROM grades WHERE code = 'PRIM';
    SELECT id INTO seg_id FROM grades WHERE code = 'SEG';
    SELECT id INTO terc_id FROM grades WHERE code = 'TERC';
    SELECT id INTO cuart_id FROM grades WHERE code = 'CUART';
    SELECT id INTO quint_id FROM grades WHERE code = 'QUINT';

    -- Insertar estudiantes de prueba
    INSERT INTO students (name, grade_id) VALUES
        ('Sofía González', jardin_id),
        ('Mateo Ramírez', jardin_id),
        ('Valentina Torres', trans_id),
        ('Santiago Díaz', trans_id),
        ('Isabella Castro', prim_id),
        ('Sebastián Morales', seg_id),
        ('Camila Herrera', terc_id),
        ('Juan Pérez', cuart_id),
        ('María García', cuart_id),
        ('Carlos López', quint_id),
        ('Ana Martínez', quint_id),
        ('Luis Rodríguez', quint_id);

    -- Insertar asistencias de prueba para hoy
    INSERT INTO attendances (student_id, date, status, notes)
    SELECT 
        id,
        CURRENT_DATE,
        CASE WHEN random() > 0.2 THEN 'present' ELSE 'absent' END,
        CASE WHEN random() > 0.5 THEN NULL ELSE 'Observación de prueba' END
    FROM students
    LIMIT 8;

    -- Insertar asistencias de ayer
    INSERT INTO attendances (student_id, date, status, notes)
    SELECT 
        id,
        CURRENT_DATE - INTERVAL '1 day',
        CASE WHEN random() > 0.15 THEN 'present' ELSE 'absent' END,
        NULL
    FROM students
    LIMIT 10;
END $$;

-- ================================================
-- VERIFICACIÓN Y ESTADÍSTICAS
-- ================================================

-- Resumen de grados
SELECT 
    '📚 Grados configurados:' as info,
    COUNT(*) as total,
    COUNT(CASE WHEN active THEN 1 END) as activos
FROM grades;

SELECT 
    name as grado,
    display_order as orden,
    CASE WHEN active THEN '✅ Activo' ELSE '❌ Inactivo' END as estado
FROM grades
ORDER BY display_order;

-- Resumen de estudiantes
SELECT 
    '👥 Estudiantes registrados:' as info,
    COUNT(*) as total,
    COUNT(CASE WHEN active THEN 1 END) as activos
FROM students;

SELECT 
    g.name as grado,
    COUNT(s.id) as cantidad_estudiantes
FROM grades g
LEFT JOIN students s ON g.id = s.grade_id
GROUP BY g.id, g.name, g.display_order
ORDER BY g.display_order;

-- Resumen de asistencias
SELECT 
    '📋 Asistencias registradas:' as info,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'present' THEN 1 END) as presentes,
    COUNT(CASE WHEN status = 'absent' THEN 1 END) as ausentes
FROM attendances;

-- ================================================
-- FIN DEL SCRIPT
-- ================================================
SELECT '✅ Base de datos inicializada correctamente' as resultado;
