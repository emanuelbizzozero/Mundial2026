const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const realMatches = [
  // Grupo A
  { matchday_id: 1, local_team: 'México', visitante_team: 'Sudáfrica', match_date: '2026-06-11', match_time: '14:00', stadium: 'Estadio Azteca, CDMX', group_name: 'Grupo A' },
  { matchday_id: 1, local_team: 'Corea del Sur', visitante_team: 'Repechaje D', match_date: '2026-06-11', match_time: '17:00', stadium: 'Estadio Akron, Guadalajara', group_name: 'Grupo A' },
  
  // Grupo B
  { matchday_id: 1, local_team: 'Canadá', visitante_team: 'Suiza', match_date: '2026-06-12', match_time: '14:00', stadium: 'BMO Field, Toronto', group_name: 'Grupo B' },
  { matchday_id: 1, local_team: 'Qatar', visitante_team: 'Repechaje A', match_date: '2026-06-12', match_time: '17:00', stadium: 'BC Place, Vancouver', group_name: 'Grupo B' },

  // Grupo C
  { matchday_id: 1, local_team: 'Brasil', visitante_team: 'Marruecos', match_date: '2026-06-12', match_time: '19:00', stadium: 'Lumen Field, Seattle', group_name: 'Grupo C' },
  { matchday_id: 1, local_team: 'Haití', visitante_team: 'Escocia', match_date: '2026-06-12', match_time: '21:00', stadium: 'Levi\'s Stadium, San Francisco', group_name: 'Grupo C' },

  // Grupo D
  { matchday_id: 1, local_team: 'Estados Unidos', visitante_team: 'Paraguay', match_date: '2026-06-13', match_time: '14:00', stadium: 'SoFi Stadium, Los Angeles', group_name: 'Grupo D' },
  { matchday_id: 1, local_team: 'Australia', visitante_team: 'Repechaje B', match_date: '2026-06-13', match_time: '17:00', stadium: 'NRG Stadium, Houston', group_name: 'Grupo D' },

  // Grupo E
  { matchday_id: 1, local_team: 'Alemania', visitante_team: 'Ecuador', match_date: '2026-06-13', match_time: '19:00', stadium: 'AT&T Stadium, Dallas', group_name: 'Grupo E' },
  { matchday_id: 1, local_team: 'Costa de Marfil', visitante_team: 'Curazao', match_date: '2026-06-13', match_time: '21:00', stadium: 'Arrowhead Stadium, Kansas City', group_name: 'Grupo E' },

  // Grupo F
  { matchday_id: 1, local_team: 'Países Bajos', visitante_team: 'Japón', match_date: '2026-06-14', match_time: '14:00', stadium: 'Mercedes-Benz Stadium, Atlanta', group_name: 'Grupo F' },
  { matchday_id: 1, local_team: 'Túnez', visitante_team: 'Repechaje C', match_date: '2026-06-14', match_time: '17:00', stadium: 'Hard Rock Stadium, Miami', group_name: 'Grupo F' },

  // Grupo G
  { matchday_id: 1, local_team: 'Bélgica', visitante_team: 'Irán', match_date: '2026-06-14', match_time: '19:00', stadium: 'Gillette Stadium, Boston', group_name: 'Grupo G' },
  { matchday_id: 1, local_team: 'Egipto', visitante_team: 'Nueva Zelanda', match_date: '2026-06-14', match_time: '21:00', stadium: 'MetLife Stadium, NY/NJ', group_name: 'Grupo G' },

  // Grupo H
  { matchday_id: 1, local_team: 'España', visitante_team: 'Uruguay', match_date: '2026-06-15', match_time: '14:00', stadium: 'Lincoln Financial Field, Philadelphia', group_name: 'Grupo H' },
  { matchday_id: 1, local_team: 'Arabia Saudita', visitante_team: 'Cabo Verde', match_date: '2026-06-15', match_time: '17:00', stadium: 'AT&T Stadium, Dallas', group_name: 'Grupo H' },

  // Grupo I
  { matchday_id: 1, local_team: 'Francia', visitante_team: 'Senegal', match_date: '2026-06-15', match_time: '19:00', stadium: 'SoFi Stadium, Los Angeles', group_name: 'Grupo I' },
  { matchday_id: 1, local_team: 'Noruega', visitante_team: 'Repechaje Int 2', match_date: '2026-06-15', match_time: '21:00', stadium: 'Lumen Field, Seattle', group_name: 'Grupo I' },

  // Grupo J
  { matchday_id: 1, local_team: 'Argentina', visitante_team: 'Argelia', match_date: '2026-06-16', match_time: '14:00', stadium: 'Hard Rock Stadium, Miami', group_name: 'Grupo J' },
  { matchday_id: 1, local_team: 'Austria', visitante_team: 'Jordania', match_date: '2026-06-16', match_time: '17:00', stadium: 'Mercedes-Benz Stadium, Atlanta', group_name: 'Grupo J' },

  // Grupo K
  { matchday_id: 1, local_team: 'Portugal', visitante_team: 'Colombia', match_date: '2026-06-16', match_time: '19:00', stadium: 'MetLife Stadium, NY/NJ', group_name: 'Grupo K' },
  { matchday_id: 1, local_team: 'Uzbekistán', visitante_team: 'Repechaje Int 1', match_date: '2026-06-16', match_time: '21:00', stadium: 'Gillette Stadium, Boston', group_name: 'Grupo K' },

  // Grupo L
  { matchday_id: 1, local_team: 'Inglaterra', visitante_team: 'Croacia', match_date: '2026-06-17', match_time: '14:00', stadium: 'AT&T Stadium, Dallas', group_name: 'Grupo L' },
  { matchday_id: 1, local_team: 'Ghana', visitante_team: 'Panamá', match_date: '2026-06-17', match_time: '17:00', stadium: 'Estadio Azteca, CDMX', group_name: 'Grupo L' }
];

async function updateSchedule() {
  console.log("Fetching current matches...");
  const { data: currentMatches, error: fetchError } = await supabase.from('matches').select('id').order('id', { ascending: true });
  
  if (fetchError) {
    console.error("Error fetching:", fetchError);
    return;
  }

  console.log(`Found ${currentMatches.length} matches. Updating...`);

  for (let i = 0; i < realMatches.length; i++) {
    const matchId = currentMatches[i] ? currentMatches[i].id : i + 1;
    
    const { error: updateError } = await supabase
      .from('matches')
      .upsert({
        id: matchId,
        ...realMatches[i],
        status: 'PROXIMO'
      });

    if (updateError) {
      console.error(`Error updating match ${matchId}:`, updateError);
    } else {
      console.log(`Updated match ${matchId}: ${realMatches[i].local_team} vs ${realMatches[i].visitante_team}`);
    }
  }

  console.log("Done updating schedule!");
}

updateSchedule();
