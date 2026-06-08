-- Supabase Schema for Prode Mundial 2026 (Migrado a IDs Numéricos)

-- LIMPIEZA DE TABLAS ANTERIORES PARA EVITAR CONFLICTOS
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.predictions CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.matchdays CASCADE;
DROP TABLE IF EXISTS public.economics CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Users Table (Usando SERIAL para auto-incrementar 1, 2, 3...)
CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  last_name TEXT,
  dni TEXT,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'PENDIENTE',
  role TEXT DEFAULT 'user',
  approved_by TEXT,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default Admin User (Obtendrá automáticamente el ID 1)
INSERT INTO public.users (username, password, name, email, status, role)
VALUES ('admin', 'admin123', 'Administrador', 'admin@prodemundial.com', 'ACTIVO', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 2. Economics Table
CREATE TABLE public.economics (
  id INT PRIMARY KEY DEFAULT 1,
  entry_fee INT DEFAULT 0,
  total_matchdays INT DEFAULT 0
);

INSERT INTO public.economics (id, entry_fee, total_matchdays) VALUES (1, 15000, 8) ON CONFLICT DO NOTHING;

-- 3. Matchdays Table
CREATE TABLE public.matchdays (
  id INT PRIMARY KEY,
  number INT NOT NULL,
  status TEXT DEFAULT 'PENDIENTE',
  name TEXT NOT NULL
);

INSERT INTO public.matchdays (id, number, status, name) VALUES 
  (1, 1, 'ABIERTA', 'Jornada 1 Fase de Grupos'),
  (2, 2, 'PENDIENTE', 'Jornada 2 Fase de Grupos'),
  (3, 3, 'PENDIENTE', 'Jornada 3 Fase de Grupos'),
  (4, 4, 'PENDIENTE', 'Dieciseisavos de Final'),
  (5, 5, 'PENDIENTE', 'Octavos de Final'),
  (6, 6, 'PENDIENTE', 'Cuartos de Final'),
  (7, 7, 'PENDIENTE', 'Semifinales'),
  (8, 8, 'PENDIENTE', 'Final')
ON CONFLICT (id) DO NOTHING;

-- 4. Matches Table
CREATE TABLE public.matches (
  id INT PRIMARY KEY,
  matchday_id INT REFERENCES public.matchdays(id),
  local_team TEXT NOT NULL,
  visitante_team TEXT NOT NULL,
  match_date TEXT NOT NULL,
  match_time TEXT NOT NULL,
  stadium TEXT NOT NULL,
  group_name TEXT NOT NULL,
  status TEXT DEFAULT 'PROXIMO',
  score_local INT,
  score_visitante INT
);

-- Generate 104 matches
INSERT INTO public.matches (id, matchday_id, local_team, visitante_team, match_date, match_time, stadium, group_name, status, score_local, score_visitante) VALUES
(1, 1, 'México', 'Alemania', '2026-06-11', '14:00', 'Por definir', 'Grupo A', 'PROXIMO', NULL, NULL),
(2, 1, 'Suecia', 'Argelia', '2026-06-12', '17:00', 'Por definir', 'Grupo A', 'PROXIMO', NULL, NULL),
(3, 2, 'México', 'Suecia', '2026-06-16', '14:00', 'Por definir', 'Grupo A', 'PROXIMO', NULL, NULL),
(4, 2, 'Argelia', 'Alemania', '2026-06-17', '17:00', 'Por definir', 'Grupo A', 'PROXIMO', NULL, NULL),
(5, 3, 'Argelia', 'México', '2026-06-22', '14:00', 'Por definir', 'Grupo A', 'PROXIMO', NULL, NULL),
(6, 3, 'Alemania', 'Suecia', '2026-06-22', '14:00', 'Por definir', 'Grupo A', 'PROXIMO', NULL, NULL),
(7, 1, 'Canadá', 'Croacia', '2026-06-11', '14:00', 'Por definir', 'Grupo B', 'PROXIMO', NULL, NULL),
(8, 1, 'Ecuador', 'Mali', '2026-06-12', '17:00', 'Por definir', 'Grupo B', 'PROXIMO', NULL, NULL),
(9, 2, 'Canadá', 'Ecuador', '2026-06-16', '14:00', 'Por definir', 'Grupo B', 'PROXIMO', NULL, NULL),
(10, 2, 'Mali', 'Croacia', '2026-06-17', '17:00', 'Por definir', 'Grupo B', 'PROXIMO', NULL, NULL),
(11, 3, 'Mali', 'Canadá', '2026-06-22', '14:00', 'Por definir', 'Grupo B', 'PROXIMO', NULL, NULL),
(12, 3, 'Croacia', 'Ecuador', '2026-06-22', '14:00', 'Por definir', 'Grupo B', 'PROXIMO', NULL, NULL),
(13, 1, 'Estados Unidos', 'Uruguay', '2026-06-11', '14:00', 'Por definir', 'Grupo C', 'PROXIMO', NULL, NULL),
(14, 1, 'Austria', 'Costa de Marfil', '2026-06-12', '17:00', 'Por definir', 'Grupo C', 'PROXIMO', NULL, NULL),
(15, 2, 'Estados Unidos', 'Austria', '2026-06-16', '14:00', 'Por definir', 'Grupo C', 'PROXIMO', NULL, NULL),
(16, 2, 'Costa de Marfil', 'Uruguay', '2026-06-17', '17:00', 'Por definir', 'Grupo C', 'PROXIMO', NULL, NULL),
(17, 3, 'Costa de Marfil', 'Estados Unidos', '2026-06-22', '14:00', 'Por definir', 'Grupo C', 'PROXIMO', NULL, NULL),
(18, 3, 'Uruguay', 'Austria', '2026-06-22', '14:00', 'Por definir', 'Grupo C', 'PROXIMO', NULL, NULL),
(19, 1, 'Argentina', 'Senegal', '2026-06-11', '14:00', 'Por definir', 'Grupo D', 'PROXIMO', NULL, NULL),
(20, 1, 'Polonia', 'Arabia Saudita', '2026-06-12', '17:00', 'Por definir', 'Grupo D', 'PROXIMO', NULL, NULL),
(21, 2, 'Argentina', 'Polonia', '2026-06-16', '14:00', 'Por definir', 'Grupo D', 'PROXIMO', NULL, NULL),
(22, 2, 'Arabia Saudita', 'Senegal', '2026-06-17', '17:00', 'Por definir', 'Grupo D', 'PROXIMO', NULL, NULL),
(23, 3, 'Arabia Saudita', 'Argentina', '2026-06-22', '14:00', 'Por definir', 'Grupo D', 'PROXIMO', NULL, NULL),
(24, 3, 'Senegal', 'Polonia', '2026-06-22', '14:00', 'Por definir', 'Grupo D', 'PROXIMO', NULL, NULL),
(25, 1, 'Brasil', 'Japón', '2026-06-11', '14:00', 'Por definir', 'Grupo E', 'PROXIMO', NULL, NULL),
(26, 1, 'Gales', 'Camerún', '2026-06-12', '17:00', 'Por definir', 'Grupo E', 'PROXIMO', NULL, NULL),
(27, 2, 'Brasil', 'Gales', '2026-06-16', '14:00', 'Por definir', 'Grupo E', 'PROXIMO', NULL, NULL),
(28, 2, 'Camerún', 'Japón', '2026-06-17', '17:00', 'Por definir', 'Grupo E', 'PROXIMO', NULL, NULL),
(29, 3, 'Camerún', 'Brasil', '2026-06-22', '14:00', 'Por definir', 'Grupo E', 'PROXIMO', NULL, NULL),
(30, 3, 'Japón', 'Gales', '2026-06-22', '14:00', 'Por definir', 'Grupo E', 'PROXIMO', NULL, NULL),
(31, 1, 'Francia', 'Marruecos', '2026-06-11', '14:00', 'Por definir', 'Grupo F', 'PROXIMO', NULL, NULL),
(32, 1, 'Serbia', 'Qatar', '2026-06-12', '17:00', 'Por definir', 'Grupo F', 'PROXIMO', NULL, NULL),
(33, 2, 'Francia', 'Serbia', '2026-06-16', '14:00', 'Por definir', 'Grupo F', 'PROXIMO', NULL, NULL),
(34, 2, 'Qatar', 'Marruecos', '2026-06-17', '17:00', 'Por definir', 'Grupo F', 'PROXIMO', NULL, NULL),
(35, 3, 'Qatar', 'Francia', '2026-06-22', '14:00', 'Por definir', 'Grupo F', 'PROXIMO', NULL, NULL),
(36, 3, 'Marruecos', 'Serbia', '2026-06-22', '14:00', 'Por definir', 'Grupo F', 'PROXIMO', NULL, NULL),
(37, 1, 'Inglaterra', 'Suiza', '2026-06-11', '14:00', 'Por definir', 'Grupo G', 'PROXIMO', NULL, NULL),
(38, 1, 'Perú', 'Costa Rica', '2026-06-12', '17:00', 'Por definir', 'Grupo G', 'PROXIMO', NULL, NULL),
(39, 2, 'Inglaterra', 'Perú', '2026-06-16', '14:00', 'Por definir', 'Grupo G', 'PROXIMO', NULL, NULL),
(40, 2, 'Costa Rica', 'Suiza', '2026-06-17', '17:00', 'Por definir', 'Grupo G', 'PROXIMO', NULL, NULL),
(41, 3, 'Costa Rica', 'Inglaterra', '2026-06-22', '14:00', 'Por definir', 'Grupo G', 'PROXIMO', NULL, NULL),
(42, 3, 'Suiza', 'Perú', '2026-06-22', '14:00', 'Por definir', 'Grupo G', 'PROXIMO', NULL, NULL),
(43, 1, 'España', 'Dinamarca', '2026-06-11', '14:00', 'Por definir', 'Grupo H', 'PROXIMO', NULL, NULL),
(44, 1, 'Chile', 'Panamá', '2026-06-12', '17:00', 'Por definir', 'Grupo H', 'PROXIMO', NULL, NULL),
(45, 2, 'España', 'Chile', '2026-06-16', '14:00', 'Por definir', 'Grupo H', 'PROXIMO', NULL, NULL),
(46, 2, 'Panamá', 'Dinamarca', '2026-06-17', '17:00', 'Por definir', 'Grupo H', 'PROXIMO', NULL, NULL),
(47, 3, 'Panamá', 'España', '2026-06-22', '14:00', 'Por definir', 'Grupo H', 'PROXIMO', NULL, NULL),
(48, 3, 'Dinamarca', 'Chile', '2026-06-22', '14:00', 'Por definir', 'Grupo H', 'PROXIMO', NULL, NULL),
(49, 1, 'Portugal', 'Corea del Sur', '2026-06-11', '14:00', 'Por definir', 'Grupo I', 'PROXIMO', NULL, NULL),
(50, 1, 'Nigeria', 'Jamaica', '2026-06-12', '17:00', 'Por definir', 'Grupo I', 'PROXIMO', NULL, NULL),
(51, 2, 'Portugal', 'Nigeria', '2026-06-16', '14:00', 'Por definir', 'Grupo I', 'PROXIMO', NULL, NULL),
(52, 2, 'Jamaica', 'Corea del Sur', '2026-06-17', '17:00', 'Por definir', 'Grupo I', 'PROXIMO', NULL, NULL),
(53, 3, 'Jamaica', 'Portugal', '2026-06-22', '14:00', 'Por definir', 'Grupo I', 'PROXIMO', NULL, NULL),
(54, 3, 'Corea del Sur', 'Nigeria', '2026-06-22', '14:00', 'Por definir', 'Grupo I', 'PROXIMO', NULL, NULL),
(55, 1, 'Países Bajos', 'Australia', '2026-06-11', '14:00', 'Por definir', 'Grupo J', 'PROXIMO', NULL, NULL),
(56, 1, 'Egipto', 'Nueva Zelanda', '2026-06-12', '17:00', 'Por definir', 'Grupo J', 'PROXIMO', NULL, NULL),
(57, 2, 'Países Bajos', 'Egipto', '2026-06-16', '14:00', 'Por definir', 'Grupo J', 'PROXIMO', NULL, NULL),
(58, 2, 'Nueva Zelanda', 'Australia', '2026-06-17', '17:00', 'Por definir', 'Grupo J', 'PROXIMO', NULL, NULL),
(59, 3, 'Nueva Zelanda', 'Países Bajos', '2026-06-22', '14:00', 'Por definir', 'Grupo J', 'PROXIMO', NULL, NULL),
(60, 3, 'Australia', 'Egipto', '2026-06-22', '14:00', 'Por definir', 'Grupo J', 'PROXIMO', NULL, NULL),
(61, 1, 'Bélgica', 'Irán', '2026-06-11', '14:00', 'Por definir', 'Grupo K', 'PROXIMO', NULL, NULL),
(62, 1, 'Ucrania', 'Venezuela', '2026-06-12', '17:00', 'Por definir', 'Grupo K', 'PROXIMO', NULL, NULL),
(63, 2, 'Bélgica', 'Ucrania', '2026-06-16', '14:00', 'Por definir', 'Grupo K', 'PROXIMO', NULL, NULL),
(64, 2, 'Venezuela', 'Irán', '2026-06-17', '17:00', 'Por definir', 'Grupo K', 'PROXIMO', NULL, NULL),
(65, 3, 'Venezuela', 'Bélgica', '2026-06-22', '14:00', 'Por definir', 'Grupo K', 'PROXIMO', NULL, NULL),
(66, 3, 'Irán', 'Ucrania', '2026-06-22', '14:00', 'Por definir', 'Grupo K', 'PROXIMO', NULL, NULL),
(67, 1, 'Italia', 'Colombia', '2026-06-11', '14:00', 'Por definir', 'Grupo L', 'PROXIMO', NULL, NULL),
(68, 1, 'Hungría', 'Paraguay', '2026-06-12', '17:00', 'Por definir', 'Grupo L', 'PROXIMO', NULL, NULL),
(69, 2, 'Italia', 'Hungría', '2026-06-16', '14:00', 'Por definir', 'Grupo L', 'PROXIMO', NULL, NULL),
(70, 2, 'Paraguay', 'Colombia', '2026-06-17', '17:00', 'Por definir', 'Grupo L', 'PROXIMO', NULL, NULL),
(71, 3, 'Paraguay', 'Italia', '2026-06-22', '14:00', 'Por definir', 'Grupo L', 'PROXIMO', NULL, NULL),
(72, 3, 'Colombia', 'Hungría', '2026-06-22', '14:00', 'Por definir', 'Grupo L', 'PROXIMO', NULL, NULL),
(73, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 1', 'PROXIMO', NULL, NULL),
(74, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 2', 'PROXIMO', NULL, NULL),
(75, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 3', 'PROXIMO', NULL, NULL),
(76, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 4', 'PROXIMO', NULL, NULL),
(77, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 5', 'PROXIMO', NULL, NULL),
(78, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 6', 'PROXIMO', NULL, NULL),
(79, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 7', 'PROXIMO', NULL, NULL),
(80, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 8', 'PROXIMO', NULL, NULL),
(81, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 9', 'PROXIMO', NULL, NULL),
(82, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 10', 'PROXIMO', NULL, NULL),
(83, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 11', 'PROXIMO', NULL, NULL),
(84, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 12', 'PROXIMO', NULL, NULL),
(85, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 13', 'PROXIMO', NULL, NULL),
(86, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 14', 'PROXIMO', NULL, NULL),
(87, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 15', 'PROXIMO', NULL, NULL),
(88, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave 16', 'PROXIMO', NULL, NULL),
(89, 5, 'Ganador Llave A', 'Ganador Llave B', '2026-07-04', '16:00', 'Por definir', 'Octavos - Llave 1', 'PROXIMO', NULL, NULL),
(90, 5, 'Ganador Llave A', 'Ganador Llave B', '2026-07-04', '16:00', 'Por definir', 'Octavos - Llave 2', 'PROXIMO', NULL, NULL),
(91, 5, 'Ganador Llave A', 'Ganador Llave B', '2026-07-04', '16:00', 'Por definir', 'Octavos - Llave 3', 'PROXIMO', NULL, NULL),
(92, 5, 'Ganador Llave A', 'Ganador Llave B', '2026-07-04', '16:00', 'Por definir', 'Octavos - Llave 4', 'PROXIMO', NULL, NULL),
(93, 5, 'Ganador Llave A', 'Ganador Llave B', '2026-07-04', '16:00', 'Por definir', 'Octavos - Llave 5', 'PROXIMO', NULL, NULL),
(94, 5, 'Ganador Llave A', 'Ganador Llave B', '2026-07-04', '16:00', 'Por definir', 'Octavos - Llave 6', 'PROXIMO', NULL, NULL),
(95, 5, 'Ganador Llave A', 'Ganador Llave B', '2026-07-04', '16:00', 'Por definir', 'Octavos - Llave 7', 'PROXIMO', NULL, NULL),
(96, 5, 'Ganador Llave A', 'Ganador Llave B', '2026-07-04', '16:00', 'Por definir', 'Octavos - Llave 8', 'PROXIMO', NULL, NULL),
(97, 6, 'Ganador Octavos A', 'Ganador Octavos B', '2026-07-09', '17:00', 'Por definir', 'Cuartos - Llave 1', 'PROXIMO', NULL, NULL),
(98, 6, 'Ganador Octavos A', 'Ganador Octavos B', '2026-07-09', '17:00', 'Por definir', 'Cuartos - Llave 2', 'PROXIMO', NULL, NULL),
(99, 6, 'Ganador Octavos A', 'Ganador Octavos B', '2026-07-09', '17:00', 'Por definir', 'Cuartos - Llave 3', 'PROXIMO', NULL, NULL),
(100, 6, 'Ganador Octavos A', 'Ganador Octavos B', '2026-07-09', '17:00', 'Por definir', 'Cuartos - Llave 4', 'PROXIMO', NULL, NULL),
(101, 7, 'Ganador Cuartos 1', 'Ganador Cuartos 2', '2026-07-14', '20:00', 'AT&T Stadium', 'Semifinal 1', 'PROXIMO', NULL, NULL),
(102, 7, 'Ganador Cuartos 3', 'Ganador Cuartos 4', '2026-07-15', '20:00', 'Mercedes-Benz Stadium', 'Semifinal 2', 'PROXIMO', NULL, NULL),
(103, 8, 'Ganador Semi 1', 'Ganador Semi 2', '2026-07-19', '15:00', 'MetLife Stadium', 'Final', 'PROXIMO', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 5. Predictions Table (Usando SERIAL y referencia INT)
CREATE TABLE public.predictions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
  matchday_id INT REFERENCES public.matchdays(id),
  match_id INT REFERENCES public.matches(id),
  predicted_local INT NOT NULL,
  predicted_visitante INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Audit Logs Table (Usando SERIAL)
CREATE TABLE public.audit_logs (
  id SERIAL PRIMARY KEY,
  log_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL,
  detail TEXT
);

-- Disable RLS for all tables so the public web app can access them
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.economics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.matchdays DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;