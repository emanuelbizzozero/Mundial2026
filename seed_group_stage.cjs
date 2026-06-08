const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const groups = {
  'A': ['México', 'Sudáfrica', 'Corea del Sur', 'Repechaje D'],
  'B': ['Canadá', 'Suiza', 'Qatar', 'Repechaje A'],
  'C': ['Brasil', 'Marruecos', 'Haití', 'Escocia'],
  'D': ['Estados Unidos', 'Paraguay', 'Australia', 'Repechaje B'],
  'E': ['Alemania', 'Ecuador', 'Costa de Marfil', 'Curazao'],
  'F': ['Países Bajos', 'Japón', 'Túnez', 'Repechaje C'],
  'G': ['Bélgica', 'Irán', 'Egipto', 'Nueva Zelanda'],
  'H': ['España', 'Uruguay', 'Arabia Saudita', 'Cabo Verde'],
  'I': ['Francia', 'Senegal', 'Noruega', 'Repechaje Int 2'],
  'J': ['Argentina', 'Argelia', 'Austria', 'Jordania'],
  'K': ['Portugal', 'Colombia', 'Uzbekistán', 'Repechaje Int 1'],
  'L': ['Inglaterra', 'Croacia', 'Ghana', 'Panamá']
};

const stadiums = [
  'Estadio Azteca, CDMX', 'Estadio Akron, Guadalajara', 'BMO Field, Toronto', 
  'BC Place, Vancouver', 'Lumen Field, Seattle', 'Levi\'s Stadium, San Francisco',
  'SoFi Stadium, Los Angeles', 'NRG Stadium, Houston', 'AT&T Stadium, Dallas',
  'Arrowhead Stadium, Kansas City', 'Mercedes-Benz Stadium, Atlanta', 'Hard Rock Stadium, Miami',
  'Gillette Stadium, Boston', 'MetLife Stadium, NY/NJ', 'Lincoln Financial Field, Philadelphia'
];

async function seedMatches() {
  console.log("Limpiando predicciones y partidos...");
  
  // Limpiar predicciones primero (por llaves foráneas)
  let { data: preds } = await supabase.from('predictions').select('id');
  if (preds && preds.length > 0) {
    await supabase.from('predictions').delete().in('id', preds.map(p => p.id));
  }

  // Limpiar partidos
  let { data: currentMatches } = await supabase.from('matches').select('id');
  if (currentMatches && currentMatches.length > 0) {
    const chunk = 50;
    for (let i = 0; i < currentMatches.length; i += chunk) {
      const idsToDelete = currentMatches.slice(i, i + chunk).map(m => m.id);
      await supabase.from('matches').delete().in('id', idsToDelete);
    }
  }

  console.log("Insertando 72 partidos de fase de grupos reales...");

  const newMatches = [];
  let matchId = 1;
  let stadiumIndex = 0;

  // Fechas base para Jornada 1, 2 y 3
  const datesJ1 = ['2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16'];
  const datesJ2 = ['2026-06-16', '2026-06-17', '2026-06-18', '2026-06-19', '2026-06-20', '2026-06-21'];
  const datesJ3 = ['2026-06-22', '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27'];

  const getStadium = () => {
    const st = stadiums[stadiumIndex];
    stadiumIndex = (stadiumIndex + 1) % stadiums.length;
    return st;
  };

  const groupKeys = Object.keys(groups);
  
  // Jornada 1: Team 1 vs 2, Team 3 vs 4
  for (let i=0; i<groupKeys.length; i++) {
    const g = groupKeys[i];
    const date = datesJ1[Math.floor(i / 2)];
    newMatches.push({ id: matchId++, matchday_id: 1, group_name: 'Grupo ' + g, local_team: groups[g][0], visitante_team: groups[g][1], match_date: date, match_time: '14:00', stadium: getStadium(), status: 'PROXIMO' });
    newMatches.push({ id: matchId++, matchday_id: 1, group_name: 'Grupo ' + g, local_team: groups[g][2], visitante_team: groups[g][3], match_date: date, match_time: '17:00', stadium: getStadium(), status: 'PROXIMO' });
  }

  // Jornada 2: Team 1 vs 3, Team 2 vs 4
  for (let i=0; i<groupKeys.length; i++) {
    const g = groupKeys[i];
    const date = datesJ2[Math.floor(i / 2)];
    newMatches.push({ id: matchId++, matchday_id: 2, group_name: 'Grupo ' + g, local_team: groups[g][0], visitante_team: groups[g][2], match_date: date, match_time: '14:00', stadium: getStadium(), status: 'PROXIMO' });
    newMatches.push({ id: matchId++, matchday_id: 2, group_name: 'Grupo ' + g, local_team: groups[g][1], visitante_team: groups[g][3], match_date: date, match_time: '17:00', stadium: getStadium(), status: 'PROXIMO' });
  }

  // Jornada 3: Team 1 vs 4, Team 2 vs 3
  for (let i=0; i<groupKeys.length; i++) {
    const g = groupKeys[i];
    const date = datesJ3[Math.floor(i / 2)];
    newMatches.push({ id: matchId++, matchday_id: 3, group_name: 'Grupo ' + g, local_team: groups[g][0], visitante_team: groups[g][3], match_date: date, match_time: '14:00', stadium: getStadium(), status: 'PROXIMO' });
    newMatches.push({ id: matchId++, matchday_id: 3, group_name: 'Grupo ' + g, local_team: groups[g][1], visitante_team: groups[g][2], match_date: date, match_time: '17:00', stadium: getStadium(), status: 'PROXIMO' });
  }

  // Insertar todo en bloques de 30
  for (let i = 0; i < newMatches.length; i += 30) {
    const chunk = newMatches.slice(i, i + 30);
    const { error } = await supabase.from('matches').insert(chunk);
    if (error) {
      console.error("Error inserting chunk:", error);
    }
  }

  console.log("¡Los 72 partidos han sido inyectados exitosamente!");
}

seedMatches();
