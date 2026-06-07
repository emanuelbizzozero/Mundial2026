const { createClient } = require('@supabase/supabase-js');

const url = 'https://riaggsacrxhvindypfnp.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYWdnc2FjcnhodmluZHlwZm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjE3MjAsImV4cCI6MjA5NjQzNzcyMH0.avQqm9U2qg-xZ9hdeVvb0rbRXUKiHuKpUBlYKd29FIs';
const supabase = createClient(url, key);

async function inject() {
  console.log("Inyectando usuario admin...");
  const { error: errU } = await supabase.from('users').insert([
    { username: 'admin', password: 'admin123', name: 'Administrador', email: 'admin@prodemundial.com', status: 'ACTIVO', role: 'admin' }
  ]);
  if (errU) console.error("Error users:", errU);

  console.log("Inyectando economics...");
  await supabase.from('economics').insert([{ id: 1, entry_fee: 15000, total_matchdays: 8 }]);

  console.log("Inyectando matchdays...");
  await supabase.from('matchdays').insert([
    { id: 1, number: 1, status: 'ABIERTA', name: 'Jornada 1 Fase de Grupos' },
    { id: 2, number: 2, status: 'PENDIENTE', name: 'Jornada 2 Fase de Grupos' },
    { id: 3, number: 3, status: 'PENDIENTE', name: 'Jornada 3 Fase de Grupos' },
    { id: 4, number: 4, status: 'PENDIENTE', name: 'Dieciseisavos de Final' },
    { id: 5, number: 5, status: 'PENDIENTE', name: 'Octavos de Final' },
    { id: 6, number: 6, status: 'PENDIENTE', name: 'Cuartos de Final' },
    { id: 7, number: 7, status: 'PENDIENTE', name: 'Semifinales' },
    { id: 8, number: 8, status: 'PENDIENTE', name: 'Final' }
  ]);

  console.log("Generando e inyectando partidos...");
  const matches = [];
  let matchId = 1;
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

  Object.keys(groupTeams).forEach(group => {
    const teams = groupTeams[group];
    const t1 = teams[0], t2 = teams[1], t3 = teams[2], t4 = teams[3];
    matches.push({ id: matchId++, matchday_id: 1, local_team: t1, visitante_team: t2, match_date: '2026-06-11', match_time: '14:00', stadium: 'Por definir', group_name: `Grupo ${group}`, status: 'PROXIMO' });
    matches.push({ id: matchId++, matchday_id: 1, local_team: t3, visitante_team: t4, match_date: '2026-06-12', match_time: '17:00', stadium: 'Por definir', group_name: `Grupo ${group}`, status: 'PROXIMO' });
    matches.push({ id: matchId++, matchday_id: 2, local_team: t1, visitante_team: t3, match_date: '2026-06-16', match_time: '14:00', stadium: 'Por definir', group_name: `Grupo ${group}`, status: 'PROXIMO' });
    matches.push({ id: matchId++, matchday_id: 2, local_team: t4, visitante_team: t2, match_date: '2026-06-17', match_time: '17:00', stadium: 'Por definir', group_name: `Grupo ${group}`, status: 'PROXIMO' });
    matches.push({ id: matchId++, matchday_id: 3, local_team: t4, visitante_team: t1, match_date: '2026-06-22', match_time: '14:00', stadium: 'Por definir', group_name: `Grupo ${group}`, status: 'PROXIMO' });
    matches.push({ id: matchId++, matchday_id: 3, local_team: t2, visitante_team: t3, match_date: '2026-06-22', match_time: '14:00', stadium: 'Por definir', group_name: `Grupo ${group}`, status: 'PROXIMO' });
  });

  for (let i = 1; i <= 16; i++) {
    matches.push({ id: matchId++, matchday_id: 4, local_team: `1ro Grupo X`, visitante_team: `3ro Grupo Y`, match_date: '2026-06-29', match_time: '15:00', stadium: 'Por definir', group_name: `16avos - Llave ${i}`, status: 'PROXIMO' });
  }
  for (let i = 1; i <= 8; i++) {
    matches.push({ id: matchId++, matchday_id: 5, local_team: `Ganador Llave A`, visitante_team: `Ganador Llave B`, match_date: '2026-07-04', match_time: '16:00', stadium: 'Por definir', group_name: `Octavos - Llave ${i}`, status: 'PROXIMO' });
  }
  for (let i = 1; i <= 4; i++) {
    matches.push({ id: matchId++, matchday_id: 6, local_team: `Ganador Octavos A`, visitante_team: `Ganador Octavos B`, match_date: '2026-07-09', match_time: '17:00', stadium: 'Por definir', group_name: `Cuartos - Llave ${i}`, status: 'PROXIMO' });
  }
  matches.push({ id: matchId++, matchday_id: 7, local_team: `Ganador Cuartos 1`, visitante_team: `Ganador Cuartos 2`, match_date: '2026-07-14', match_time: '20:00', stadium: 'AT&T Stadium', group_name: `Semifinal 1`, status: 'PROXIMO' });
  matches.push({ id: matchId++, matchday_id: 7, local_team: `Ganador Cuartos 3`, visitante_team: `Ganador Cuartos 4`, match_date: '2026-07-15', match_time: '20:00', stadium: 'Mercedes-Benz Stadium', group_name: `Semifinal 2`, status: 'PROXIMO' });
  matches.push({ id: matchId++, matchday_id: 8, local_team: `Ganador Semi 1`, visitante_team: `Ganador Semi 2`, match_date: '2026-07-19', match_time: '15:00', stadium: 'MetLife Stadium', group_name: `Final`, status: 'PROXIMO' });

  // Insert in batches of 30 to avoid timeout
  for (let i = 0; i < matches.length; i += 30) {
    const batch = matches.slice(i, i + 30);
    const { error: errM } = await supabase.from('matches').insert(batch);
    if (errM) console.error("Error matches:", errM);
  }

  console.log("¡Todo inyectado!");
}

inject();
