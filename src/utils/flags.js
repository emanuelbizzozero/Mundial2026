const flagDictionary = {
  'México': '🇲🇽',
  'Alemania': '🇩🇪',
  'Suecia': '🇸🇪',
  'Argelia': '🇩🇿',
  'Canadá': '🇨🇦',
  'Croacia': '🇭🇷',
  'Ecuador': '🇪🇨',
  'Mali': '🇲🇱',
  'Estados Unidos': '🇺🇸',
  'Uruguay': '🇺🇾',
  'Austria': '🇦🇹',
  'Costa de Marfil': '🇨🇮',
  'Argentina': '🇦🇷',
  'Senegal': '🇸🇳',
  'Polonia': '🇵🇱',
  'Arabia Saudita': '🇸🇦',
  'Brasil': '🇧🇷',
  'Japón': '🇯🇵',
  'Gales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Camerún': '🇨🇲',
  'Francia': '🇫🇷',
  'Marruecos': '🇲🇦',
  'Serbia': '🇷🇸',
  'Qatar': '🇶🇦',
  'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Suiza': '🇨🇭',
  'Perú': '🇵🇪',
  'Costa Rica': '🇨🇷',
  'España': '🇪🇸',
  'Dinamarca': '🇩🇰',
  'Chile': '🇨🇱',
  'Panamá': '🇵🇦',
  'Portugal': '🇵🇹',
  'Corea del Sur': '🇰🇷',
  'Nigeria': '🇳🇬',
  'Jamaica': '🇯🇲',
  'Países Bajos': '🇳🇱',
  'Australia': '🇦🇺',
  'Egipto': '🇪🇬',
  'Nueva Zelanda': '🇳🇿',
  'Bélgica': '🇧🇪',
  'Irán': '🇮🇷',
  'Ucrania': '🇺🇦',
  'Venezuela': '🇻🇪',
  'Italia': '🇮🇹',
  'Colombia': '🇨🇴',
  'Hungría': '🇭🇺',
  'Paraguay': '🇵🇾',
  'Sudáfrica': '🇿🇦',
  'Haití': '🇭🇹',
  'Escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Curazao': '🇨🇼',
  'Túnez': '🇹🇳',
  'Cabo Verde': '🇨🇻',
  'Noruega': '🇳🇴',
  'Jordania': '🇯🇴',
  'Uzbekistán': '🇺🇿',
  'Ghana': '🇬🇭',
  'Repechaje A': '🌍',
  'Repechaje B': '🌍',
  'Repechaje C': '🌍',
  'Repechaje D': '🌍',
  'Repechaje Int 1': '🌍',
  'Repechaje Int 2': '🌍'
};

export const getFlag = (teamName) => {
  if (!teamName) return '';
  
  const normalized = teamName.trim().toLowerCase();
  
  // Search case-insensitively
  const match = Object.keys(flagDictionary).find(k => k.toLowerCase() === normalized);
  
  if (match) {
    return flagDictionary[match];
  }
  
  // Return a generic globe icon if no flag is found so we know it tried to render something
  return '🏳️';
};
