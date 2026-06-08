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
  'Paraguay': '🇵🇾'
};

export const getFlag = (teamName) => {
  if (!teamName) return '';
  // Check exact match
  if (flagDictionary[teamName]) {
    return flagDictionary[teamName];
  }
  // Optional: check case-insensitive or partial match if needed
  return ''; // Return nothing if not found, instead of a generic flag that might look weird
};
