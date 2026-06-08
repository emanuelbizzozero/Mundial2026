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

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function checkTeams() {
  const { data, error } = await supabase.from('matches').select('local_team, visitante_team');
  if (error) {
    console.error(error);
    return;
  }
  const teams = new Set();
  data.forEach(m => {
    if (m.local_team) teams.add(m.local_team);
    if (m.visitante_team) teams.add(m.visitante_team);
  });
  console.log('Equipos en la DB:', Array.from(teams).slice(0, 20));
}

checkTeams();
