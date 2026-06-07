const fs = require('fs');
const path = require('path');

const generateSQL = () => {
  let sql = `-- Supabase Schema for Prode Mundial 2026

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Default Admin User
INSERT INTO public.users (id, username, password, name, email, status, role)
VALUES (gen_random_uuid(), 'admin', 'admin123', 'Administrador', 'admin@prodemundial.com', 'ACTIVO', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 2. Economics Table
CREATE TABLE IF NOT EXISTS public.economics (
  id INT PRIMARY KEY DEFAULT 1,
  entry_fee INT DEFAULT 0,
  total_matchdays INT DEFAULT 0
);

INSERT INTO public.economics (id, entry_fee, total_matchdays) VALUES (1, 15000, 8) ON CONFLICT DO NOTHING;

-- 3. Matchdays Table
CREATE TABLE IF NOT EXISTS public.matchdays (
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
CREATE TABLE IF NOT EXISTS public.matches (
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
`;

  const groupTeams = {
    'A': ['México', 'Alemania', 'Suecia', 'Argelia'],
    'B': ['Canadá', 'Croacia', 'Ecuador', 'Mali'],
    'C': ['Estados Unidos', 'Uruguay', 'Austria', 'Costa de Marfil'],
    'D': ['Argentina', 'Senegal', 'Polonia', 'Arabia Saudita'],
    'E': ['Brasil', 'Japón', 'Gales', 'Camerún'],
    'F': ['Francia', 'Marruecos', 'Serbia', 'Qatar'],
    'G': ['Inglaterra', 'Suiza', 'Perú', 'Costa Rica'],
    'H': ['España', 'Dinamarca', 'Chile', 'Panamá'],
    'I': ['Portugal', 'Corea del Sur', 'Nigeria', 'Jamaica'],
    'J': ['Países Bajos', 'Australia', 'Egipto', 'Nueva Zelanda'],
    'K': ['Bélgica', 'Irán', 'Ucrania', 'Venezuela'],
    'L': ['Italia', 'Colombia', 'Hungría', 'Paraguay']
  };

  let matchId = 1;
  const matchInserts = [];

  Object.keys(groupTeams).forEach(group => {
    const [t1, t2, t3, t4] = groupTeams[group];
    matchInserts.push(`(${matchId++}, 1, '${t1}', '${t2}', '2026-06-11', '14:00', 'Por definir', 'Grupo ${group}', 'PROXIMO', NULL, NULL)`);
    matchInserts.push(`(${matchId++}, 1, '${t3}', '${t4}', '2026-06-12', '17:00', 'Por definir', 'Grupo ${group}', 'PROXIMO', NULL, NULL)`);
    matchInserts.push(`(${matchId++}, 2, '${t1}', '${t3}', '2026-06-16', '14:00', 'Por definir', 'Grupo ${group}', 'PROXIMO', NULL, NULL)`);
    matchInserts.push(`(${matchId++}, 2, '${t4}', '${t2}', '2026-06-17', '17:00', 'Por definir', 'Grupo ${group}', 'PROXIMO', NULL, NULL)`);
    matchInserts.push(`(${matchId++}, 3, '${t4}', '${t1}', '2026-06-22', '14:00', 'Por definir', 'Grupo ${group}', 'PROXIMO', NULL, NULL)`);
    matchInserts.push(`(${matchId++}, 3, '${t2}', '${t3}', '2026-06-22', '14:00', 'Por definir', 'Grupo ${group}', 'PROXIMO', NULL, NULL)`);
  });

  for (let i = 1; i <= 16; i++) matchInserts.push(`(${matchId++}, 4, '1ro Grupo X', '3ro Grupo Y', '2026-06-29', '15:00', 'Por definir', '16avos - Llave ${i}', 'PROXIMO', NULL, NULL)`);
  for (let i = 1; i <= 8; i++) matchInserts.push(`(${matchId++}, 5, 'Ganador Llave A', 'Ganador Llave B', '2026-07-04', '16:00', 'Por definir', 'Octavos - Llave ${i}', 'PROXIMO', NULL, NULL)`);
  for (let i = 1; i <= 4; i++) matchInserts.push(`(${matchId++}, 6, 'Ganador Octavos A', 'Ganador Octavos B', '2026-07-09', '17:00', 'Por definir', 'Cuartos - Llave ${i}', 'PROXIMO', NULL, NULL)`);
  
  matchInserts.push(`(${matchId++}, 7, 'Ganador Cuartos 1', 'Ganador Cuartos 2', '2026-07-14', '20:00', 'AT&T Stadium', 'Semifinal 1', 'PROXIMO', NULL, NULL)`);
  matchInserts.push(`(${matchId++}, 7, 'Ganador Cuartos 3', 'Ganador Cuartos 4', '2026-07-15', '20:00', 'Mercedes-Benz Stadium', 'Semifinal 2', 'PROXIMO', NULL, NULL)`);
  matchInserts.push(`(${matchId++}, 8, 'Ganador Semi 1', 'Ganador Semi 2', '2026-07-19', '15:00', 'MetLife Stadium', 'Final', 'PROXIMO', NULL, NULL)`);

  sql += `INSERT INTO public.matches (id, matchday_id, local_team, visitante_team, match_date, match_time, stadium, group_name, status, score_local, score_visitante) VALUES\n`;
  sql += matchInserts.join(',\n') + `\nON CONFLICT (id) DO NOTHING;\n\n`;

  sql += `-- 5. Predictions Table
CREATE TABLE IF NOT EXISTS public.predictions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  matchday_id INT REFERENCES public.matchdays(id),
  match_id INT REFERENCES public.matches(id),
  predicted_local INT NOT NULL,
  predicted_visitante INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  log_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL,
  detail TEXT
);
`;

  fs.writeFileSync(path.join(__dirname, 'supabase_schema.sql'), sql);
  console.log('SQL file generated at', path.join(__dirname, 'supabase_schema.sql'));
}

generateSQL();
