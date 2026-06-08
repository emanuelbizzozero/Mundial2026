const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    envVars[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDatabase() {
  console.log('Iniciando limpieza de la base de datos...');

  // 1. Delete all predictions
  console.log('Borrando todas las predicciones...');
  const { error: deleteError } = await supabase
    .from('predictions')
    .delete()
    .neq('id', 0); // Delete all rows
    
  if (deleteError) {
    console.error('Error al borrar predicciones:', deleteError);
    return;
  }
  console.log('✅ Predicciones borradas exitosamente.');

  // 2. Reset match results
  console.log('Reseteando los resultados de los partidos a NULL...');
  const { error: updateError } = await supabase
    .from('matches')
    .update({ score_local: null, score_visitante: null })
    .neq('id', 0); // Update all rows
    
  if (updateError) {
    console.error('Error al actualizar los partidos:', updateError);
    return;
  }
  console.log('✅ Resultados de los partidos reseteados a NULL.');

  console.log('¡Limpieza completada! La base de datos está fresca para un nuevo inicio.');
}

cleanDatabase();
