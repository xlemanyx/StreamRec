// Configuration
const CONFIG = {
  // TMDb API Configuration
  TMDB_API_KEY: '69e57fd6cbf4ecbda92f864cf0ef0969',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // OAuth Configuration (to be updated with actual credentials)
  TWITCH_CLIENT_ID: 'YOUR_TWITCH_CLIENT_ID',
  TWITCH_REDIRECT_URI: window.location.origin + '/auth/twitch',
  
  DISCORD_CLIENT_ID: 'YOUR_DISCORD_CLIENT_ID',
  DISCORD_REDIRECT_URI: window.location.origin + '/auth/discord',
  
  // Admin Users
  ADMIN_USERS: ['lemany01'],
  
  // Language Options
  LANGUAGES: [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ],
  
  // Default Settings
  DEFAULT_LANGUAGE: 'es',
  DEFAULT_ADULT_FILTER: true,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    USER: 'streamrec_user',
    TOKEN: 'streamrec_token',
    MOVIES: 'streamrec_movies',
    RECOMMENDATIONS: 'streamrec_recommendations',
    STREAMERS: 'streamrec_streamers',
  }
};

// Export for use in other modules
window.CONFIG = CONFIG;
