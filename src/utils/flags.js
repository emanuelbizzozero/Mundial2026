import React from 'react';

const countryCodes = {
  'México': 'mx',
  'Alemania': 'de',
  'Suecia': 'se',
  'Argelia': 'dz',
  'Canadá': 'ca',
  'Croacia': 'hr',
  'Ecuador': 'ec',
  'Mali': 'ml',
  'Estados Unidos': 'us',
  'Uruguay': 'uy',
  'Austria': 'at',
  'Costa de Marfil': 'ci',
  'Argentina': 'ar',
  'Senegal': 'sn',
  'Polonia': 'pl',
  'Arabia Saudita': 'sa',
  'Brasil': 'br',
  'Japón': 'jp',
  'Gales': 'gb-wls',
  'Camerún': 'cm',
  'Francia': 'fr',
  'Marruecos': 'ma',
  'Serbia': 'rs',
  'Qatar': 'qa',
  'Inglaterra': 'gb-eng',
  'Suiza': 'ch',
  'Perú': 'pe',
  'Costa Rica': 'cr',
  'España': 'es',
  'Dinamarca': 'dk',
  'Chile': 'cl',
  'Panamá': 'pa',
  'Portugal': 'pt',
  'Corea del Sur': 'kr',
  'Nigeria': 'ng',
  'Jamaica': 'jm',
  'Países Bajos': 'nl',
  'Australia': 'au',
  'Egipto': 'eg',
  'Nueva Zelanda': 'nz',
  'Bélgica': 'be',
  'Irán': 'ir',
  'Ucrania': 'ua',
  'Venezuela': 've',
  'Italia': 'it',
  'Colombia': 'co',
  'Hungría': 'hu',
  'Paraguay': 'py',
  'Sudáfrica': 'za',
  'Haití': 'ht',
  'Escocia': 'gb-sct',
  'Curazao': 'cw',
  'Túnez': 'tn',
  'Cabo Verde': 'cv',
  'Noruega': 'no',
  'Jordania': 'jo',
  'Uzbekistán': 'uz',
  'Ghana': 'gh'
};

export const getFlag = (teamName) => {
  if (!teamName) return '';
  
  const normalized = teamName.trim().toLowerCase();
  
  const match = Object.keys(countryCodes).find(k => k.toLowerCase() === normalized);
  
  if (match) {
    const code = countryCodes[match];
    return (
      <img 
        src={`https://flagcdn.com/w40/${code}.png`} 
        srcSet={`https://flagcdn.com/w80/${code}.png 2x`} 
        width="22" 
        alt={`${teamName} flag`} 
        style={{ borderRadius: '2px', display: 'inline-block', verticalAlign: 'middle', border: '1px solid rgba(255,255,255,0.1)' }} 
      />
    );
  }
  
  return <span style={{fontSize: '18px', verticalAlign: 'middle'}}>🌍</span>;
};
