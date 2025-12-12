// Streamer Page Logic
class StreamerPage {
    constructor() {
        this.streamerUsername = null;
        this.isDemo = false;
        this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
        this.adultFilter = CONFIG.DEFAULT_ADULT_FILTER;
        this.recommendations = this.loadRecommendations();
        this.init();
    }

    // Initialize the page
    init() {
        // Get streamer from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.streamerUsername = urlParams.get('username');
        this.isDemo = urlParams.get('demo') === 'true';

        if (!this.streamerUsername) {
            alert('No se especificó un streamer');
            window.location.href = '../index.html';
            return;
        }

        // Load streamer data
        this.loadStreamerData();

        // Setup language selector
        this.setupLanguageSelector();

        // Setup event listeners
        this.setupEventListeners();

        // Load initial movies
        this.loadRecommendedMovies();
    }

    // Load streamer data
    loadStreamerData() {
        // Check if current user is the streamer
        const isOwner = window.auth.isLoggedIn() &&
            window.auth.currentUser.username === this.streamerUsername;

        // Set streamer info
        document.getElementById('streamerName').textContent = this.streamerUsername;
        document.getElementById('streamerPlatform').textContent = `Streamer ${this.isDemo ? '(Demo)' : ''}`;
        document.getElementById('streamerAvatar').src =
            `https://ui-avatars.com/api/?name=${this.streamerUsername}&background=8B5CF6&color=fff&size=80`;

        // Set page title
        document.getElementById('pageTitle').textContent = `${this.streamerUsername} - StreamRec`;

        // Set share link
        const shareLink = window.location.href.split('?')[0] + `?username=${this.streamerUsername}`;
        document.getElementById('shareLink').value = shareLink;

        // Show controls if owner
        if (isOwner) {
            document.getElementById('streamerControls').style.display = 'flex';

            // Load user preferences
            if (window.auth.currentUser.language) {
                this.currentLanguage = window.auth.currentUser.language;
            }
            if (window.auth.currentUser.adultFilter !== undefined) {
                this.adultFilter = window.auth.currentUser.adultFilter;
                document.getElementById('adultFilter').checked = this.adultFilter;
            }
        }
    }

    // Setup language selector
    setupLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        if (!languageSelect) return;

        CONFIG.LANGUAGES.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = `${lang.flag} ${lang.name}`;
            if (lang.code === this.currentLanguage) {
                option.selected = true;
            }
            languageSelect.appendChild(option);
        });

        languageSelect.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.saveUserPreferences();
            this.loadRecommendedMovies();
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Adult filter toggle
        const adultFilter = document.getElementById('adultFilter');
        if (adultFilter) {
            adultFilter.addEventListener('change', (e) => {
                this.adultFilter = e.target.checked;
                this.saveUserPreferences();
                this.loadRecommendedMovies();
            });
        }

        // Search on Enter key
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchMovies();
                }
            });
        }
    }

    // Save user preferences
    saveUserPreferences() {
        if (window.auth.isLoggedIn()) {
            const user = window.auth.currentUser;
            user.language = this.currentLanguage;
            user.adultFilter = this.adultFilter;
            window.auth.saveUser(user);
        }
    }

    // Load recommendations from localStorage
    loadRecommendations() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.RECOMMENDATIONS);
        return stored ? JSON.parse(stored) : {};
    }

    // Save recommendations to localStorage
    saveRecommendations() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(this.recommendations));
    }

    // Get recommendations for this streamer
    getStreamerRecommendations() {
        if (!this.recommendations[this.streamerUsername]) {
            this.recommendations[this.streamerUsername] = [];
        }
        return this.recommendations[this.streamerUsername];
    }

    // Add recommendation
    addRecommendation(movieId, movieData) {
        if (!window.auth.isLoggedIn()) {
            alert('Debes iniciar sesión para recomendar películas');
            showAuthModal();
            return;
        }

        const recs = this.getStreamerRecommendations();
        const existingRec = recs.find(r => r.movieId === movieId);

        if (existingRec) {
            // Check if user already recommended
            const userRec = existingRec.users.find(u => u.userId === window.auth.currentUser.id);
            if (userRec) {
                if (userRec.liked) {
                    alert('Ya has recomendado esta película');
                    return;
                } else {
                    // Change from dislike to like
                    userRec.liked = true;
                    userRec.disliked = false;
                }
            } else {
                existingRec.users.push({
                    userId: window.auth.currentUser.id,
                    username: window.auth.currentUser.username,
                    avatar: window.auth.currentUser.avatar,
                    liked: true,
                    disliked: false,
                    timestamp: Date.now()
                });
            }
        } else {
            recs.push({
                movieId,
                movieData,
                users: [{
                    userId: window.auth.currentUser.id,
                    username: window.auth.currentUser.username,
                    avatar: window.auth.currentUser.avatar,
                    liked: true,
                    disliked: false,
                    timestamp: Date.now()
                }],
                addedAt: Date.now()
            });
        }

        this.saveRecommendations();
        this.loadRecommendedMovies();
    }

    // Remove recommendation (dislike)
    removeRecommendation(movieId) {
        if (!window.auth.isLoggedIn()) {
            alert('Debes iniciar sesión para dar dislike a películas');
            showAuthModal();
            return;
        }

        const recs = this.getStreamerRecommendations();
        const rec = recs.find(r => r.movieId === movieId);

        if (rec) {
            const userRec = rec.users.find(u => u.userId === window.auth.currentUser.id);
            if (userRec) {
                userRec.liked = false;
                userRec.disliked = true;
            } else {
                rec.users.push({
                    userId: window.auth.currentUser.id,
                    username: window.auth.currentUser.username,
                    avatar: window.auth.currentUser.avatar,
                    liked: false,
                    disliked: true,
                    timestamp: Date.now()
                });
            }
        }

        this.saveRecommendations();
        this.loadRecommendedMovies();
    }

    // Delete recommendation (admin only)
    deleteRecommendation(movieId) {
        if (!window.auth.isAdmin()) {
            alert('No tienes permisos de administrador');
            return;
        }

        if (!confirm('¿Estás seguro de que quieres eliminar esta recomendación?')) {
            return;
        }

        const recs = this.getStreamerRecommendations();
        const index = recs.findIndex(r => r.movieId === movieId);
        if (index !== -1) {
            recs.splice(index, 1);
            this.saveRecommendations();
            this.loadRecommendedMovies();
        }
    }

    // Load recommended movies
    async loadRecommendedMovies() {
        const recs = this.getStreamerRecommendations();

        // Filter out dislikes and apply adult filter
        const validRecs = recs.filter(rec => {
            const likesCount = rec.users.filter(u => u.liked).length;
            const dislikesCount = rec.users.filter(u => u.disliked).length;
            const score = likesCount - dislikesCount;

            // Filter adult content if enabled
            if (this.adultFilter && rec.movieData.adult) {
                return false;
            }

            return score > 0; // Only show if more likes than dislikes
        });

        // Sort by score
        validRecs.sort((a, b) => {
            const scoreA = a.users.filter(u => u.liked).length - a.users.filter(u => u.disliked).length;
            const scoreB = b.users.filter(u => u.liked).length - b.users.filter(u => u.disliked).length;
            return scoreB - scoreA;
        });

        // Update movie count
        document.getElementById('movieCount').textContent = validRecs.length;

        // If no recommendations, load popular movies
        if (validRecs.length === 0) {
            document.getElementById('sectionTitle').textContent = 'Películas Populares (Aún no hay recomendaciones)';
            await this.loadPopularMovies();
            return;
        }

        document.getElementById('sectionTitle').textContent = 'Películas Recomendadas';
        this.renderMovies(validRecs.map(r => ({
            ...r.movieData,
            _recommendationData: r
        })));
    }

    // Load popular movies
    async loadPopularMovies() {
        this.showLoading();
        const data = await window.tmdb.getPopularMovies(this.currentLanguage, !this.adultFilter);
        this.renderMovies(data.results);
    }

    // Search movies
    async searchMovies(query) {
        if (!query) {
            query = document.getElementById('searchInput').value.trim();
        }

        if (!query) {
            alert('Ingresa un término de búsqueda');
            return;
        }

        this.showLoading();
        document.getElementById('sectionTitle').textContent = `Resultados para "${query}"`;
        const data = await window.tmdb.searchMovies(query, this.currentLanguage, !this.adultFilter);
        this.renderMovies(data.results);
    }

    // Load top rated movies
    async loadTopRatedMovies() {
        this.showLoading();
        document.getElementById('sectionTitle').textContent = 'Películas Mejor Valoradas';
        const data = await window.tmdb.getTopRatedMovies(this.currentLanguage, !this.adultFilter);
        this.renderMovies(data.results);
    }

    // Show loading state
    showLoading() {
        const grid = document.getElementById('movieGrid');
        grid.innerHTML = `
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    `;
    }

    // Render movies
    async renderMovies(movies) {
        const grid = document.getElementById('movieGrid');

        if (movies.length === 0) {
            grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🎬</div>
          <h3>No se encontraron películas</h3>
          <p>Intenta con otra búsqueda</p>
        </div>
      `;
            return;
        }

        grid.innerHTML = '';

        for (const movie of movies) {
            const card = await this.createMovieCard(movie);
            grid.appendChild(card);
        }
    }

    // Create movie card
    async createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card fade-in';

        // Get recommendation data if it exists
        const recData = movie._recommendationData;
        const likesCount = recData ? recData.users.filter(u => u.liked).length : 0;
        const recommenders = recData ? recData.users.filter(u => u.liked) : [];

        // Check user's recommendation status
        let userRecommendation = null;
        if (window.auth.isLoggedIn() && recData) {
            userRecommendation = recData.users.find(u => u.userId === window.auth.currentUser.id);
        }

        // Get trailer
        const trailer = await window.tmdb.getMovieVideos(movie.id, this.currentLanguage);
        const trailerUrl = trailer ? window.tmdb.getYouTubeUrl(trailer.key) : null;

        card.innerHTML = `
      ${movie.adult ? '<div class="adult-badge">+18</div>' : ''}
      ${recData ? `
        <div class="recommendation-badge">
          ❤️ ${likesCount}
        </div>
        ${recommenders.length > 0 ? `
          <div class="recommenders-list">
            <h4>Recomendado por:</h4>
            ${recommenders.map(user => `
              <div class="recommender-item">
                <div class="recommender-avatar">${user.username.charAt(0).toUpperCase()}</div>
                <span>${user.username}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      ` : ''}
      
      <img 
        src="${window.tmdb.getPosterUrl(movie.poster_path)}" 
        alt="${movie.title}"
        class="movie-poster"
      >
      
      ${trailerUrl ? `
        <div class="trailer-container">
          <iframe 
            class="trailer-iframe" 
            src="${trailerUrl}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      ` : ''}
      
      <div class="movie-overlay">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-info">
          <span class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}</span>
          <span>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
        </div>
        <div class="movie-actions">
          <button 
            class="action-btn ${userRecommendation?.liked ? 'liked' : ''}" 
            onclick="streamerPage.addRecommendation(${movie.id}, ${JSON.stringify(movie).replace(/"/g, '&quot;')})"
          >
            👍 Recomendar
          </button>
          <button 
            class="action-btn ${userRecommendation?.disliked ? 'disliked' : ''}" 
            onclick="streamerPage.removeRecommendation(${movie.id})"
          >
            👎 Dislike
          </button>
          ${window.auth.isAdmin() ? `
            <button 
              class="action-btn" 
              onclick="streamerPage.deleteRecommendation(${movie.id})"
              style="background: var(--secondary); border-color: var(--secondary);"
            >
              🗑️
            </button>
          ` : ''}
        </div>
      </div>
    `;

        return card;
    }
}

// Global functions
function copyShareLink() {
    const input = document.getElementById('shareLink');
    input.select();
    document.execCommand('copy');
    alert('¡Link copiado al portapapeles!');
}

async function searchMovies() {
    await window.streamerPage.searchMovies();
}

async function loadPopularMovies() {
    await window.streamerPage.loadPopularMovies();
}

async function loadTopRatedMovies() {
    await window.streamerPage.loadTopRatedMovies();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.streamerPage = new StreamerPage();
    });
} else {
    window.streamerPage = new StreamerPage();
}
