CREATE DATABASE health_db;

-- Conectar a la base de datos recién creada
\c health_db;

-- Crear la tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS health (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    frequency INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL
);

INSERT INTO health (name, endpoint, frequency, email) VALUES
('users', 'http://user_server:8080/api/health', 120, 'judaniel.cardona@gmail.com'),
('logs', 'http://logs_server:8081/logs/health', 130, 'judaniel.cardona@gmail.com');
