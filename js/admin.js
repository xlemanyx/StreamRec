// Admin Dashboard Logic
class AdminDashboard {
    constructor() {
        this.recommendations = this.loadRecommendations();
        this.actionsLog = this.loadActionsLog();
        this.currentEditMovie = null;
        this.currentEditStreamer = null;
        this.init();
    }

    init() {
        // Check admin access
        if (!window.auth.isAdmin()) {
            alert('Acceso denegado. Solo el usuario lemany01 puede acceder al panel de administración.');
            window.location.href = '../index.html';
            return;
        }

        this.loadDashboard();
    }

    // Load recommendations from localStorage
    loadRecommendations() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.RECOMMENDATIONS);
        return stored ? JSON.parse(stored) : {};
    }

    // Save recommendations
    saveRecommendations() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(this.recommendations));
    }

    // Load actions log
    loadActionsLog() {
        const stored = localStorage.getItem('streamrec_admin_log');
        return stored ? JSON.parse(stored) : [];
    }

    // Save actions log
    saveActionsLog() {
        localStorage.setItem('streamrec_admin_log', JSON.stringify(this.actionsLog));
    }

    // Add action to log
    logAction(action, details) {
        this.actionsLog.unshift({
            action,
            details,
            timestamp: Date.now(),
            admin: window.auth.currentUser.username
        });

        // Keep only last 50 actions
        if (this.actionsLog.length > 50) {
            this.actionsLog = this.actionsLog.slice(0, 50);
        }

        this.saveActionsLog();
        this.renderActionsLog();
    }

    // Load dashboard data
    loadDashboard() {
        this.calculateStats();
        this.renderStreamersList();
        this.renderActionsLog();
    }

    // Calculate stats
    calculateStats() {
        const streamersCount = Object.keys(this.recommendations).length;
        let totalRecs = 0;

        Object.values(this.recommendations).forEach(streamers => {
            streamers.forEach(rec => {
                totalRecs += rec.users.filter(u => u.liked).length;
            });
        });

        // Get unique users
        const users = new Set();
        Object.values(this.recommendations).forEach(streamers => {
            streamers.forEach(rec => {
                rec.users.forEach(u => users.add(u.userId));
            });
        });

        document.getElementById('totalStreamers').textContent = streamersCount;
        document.getElementById('totalRecommendations').textContent = totalRecs;
        document.getElementById('totalUsers').textContent = users.size;
    }

    // Render streamers list
    renderStreamersList() {
        const container = document.getElementById('streamersList');

        if (Object.keys(this.recommendations).length === 0) {
            container.innerHTML = '<p class="text-muted">No hay streamers con recomendaciones aún</p>';
            return;
        }

        container.innerHTML = '';

        Object.keys(this.recommendations).forEach(streamerUsername => {
            const recs = this.recommendations[streamerUsername];
            if (recs.length === 0) return;

            const streamerSection = document.createElement('div');
            streamerSection.className = 'streamer-section';

            const likesCount = recs.reduce((sum, rec) =>
                sum + rec.users.filter(u => u.liked).length, 0
            );

            streamerSection.innerHTML = `
        <div class="streamer-header">
          <div class="flex gap-2 align-items-center">
            <img 
              src="https://ui-avatars.com/api/?name=${streamerUsername}&background=8B5CF6&color=fff&size=40" 
              style="width: 40px; height: 40px; border-radius: 50%;"
            >
            <div>
              <h3 style="margin-bottom: 0.25rem;">${streamerUsername}</h3>
              <p class="text-muted" style="font-size: 0.875rem;">
                ${recs.length} películas • ${likesCount} recomendaciones
              </p>
            </div>
          </div>
          <a href="streamer.html?username=${streamerUsername}" class="btn btn-secondary" target="_blank">
            Ver Página
          </a>
        </div>
        <div id="recs-${streamerUsername}"></div>
      `;

            container.appendChild(streamerSection);

            // Render recommendations for this streamer
            const recsContainer = document.getElementById(`recs-${streamerUsername}`);
            recs.forEach(rec => {
                const likes = rec.users.filter(u => u.liked).length;
                const dislikes = rec.users.filter(u => u.disliked).length;

                const recItem = document.createElement('div');
                recItem.className = 'recommendation-item';
                recItem.innerHTML = `
          <div class="flex gap-3 align-items-center" style="flex: 1;">
            <img 
              src="https://image.tmdb.org/t/p/w92${rec.movieData.poster_path}" 
              alt="${rec.movieData.title}"
              style="width: 60px; height: 90px; border-radius: var(--radius-sm); object-fit: cover;"
            >
            <div style="flex: 1;">
              <h4 style="margin-bottom: 0.25rem;">${rec.movieData.title}</h4>
              <div class="flex gap-3" style="font-size: 0.875rem; color: var(--text-muted);">
                <span>⭐ ${rec.movieData.vote_average.toFixed(1)}</span>
                <span>👍 ${likes}</span>
                <span>👎 ${dislikes}</span>
                <span>${rec.movieData.release_date ? rec.movieData.release_date.split('-')[0] : 'N/A'}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button 
              class="btn-icon" 
              onclick="adminDashboard.openEditModal('${streamerUsername}', ${rec.movieId}, '${rec.movieData.title.replace(/'/g, "\\'")}')"
              title="Modificar puntuación"
            >
              ✏️
            </button>
            <button 
              class="btn-icon" 
              onclick="adminDashboard.deleteRecommendation('${streamerUsername}', ${rec.movieId}, '${rec.movieData.title.replace(/'/g, "\\'")}')"
              title="Eliminar"
              style="background: rgba(236, 72, 153, 0.2); border-color: var(--secondary);"
            >
              🗑️
            </button>
          </div>
        `;
                recsContainer.appendChild(recItem);
            });
        });
    }

    // Render actions log
    renderActionsLog() {
        const container = document.getElementById('actionsLog');

        if (this.actionsLog.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay acciones registradas aún</p>';
            return;
        }

        container.innerHTML = '';

        this.actionsLog.slice(0, 20).forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';

            const date = new Date(log.timestamp);
            const timeStr = date.toLocaleString('es-ES');

            logEntry.innerHTML = `
        <div class="flex-between mb-1">
          <strong>${log.action}</strong>
          <span class="timestamp">${timeStr}</span>
        </div>
        <div class="text-muted">${log.details}</div>
      `;

            container.appendChild(logEntry);
        });
    }

    // Open edit modal
    openEditModal(streamer, movieId, movieTitle) {
        this.currentEditStreamer = streamer;
        this.currentEditMovie = movieId;

        document.getElementById('editMovieTitle').textContent = movieTitle;

        // Get current score
        const rec = this.recommendations[streamer].find(r => r.movieId === movieId);
        if (rec && rec.customScore !== undefined) {
            document.getElementById('customScore').value = rec.customScore;
        } else if (rec) {
            document.getElementById('customScore').value = rec.movieData.vote_average;
        }

        document.getElementById('editScoreModal').style.display = 'block';
    }

    // Save custom score
    saveCustomScore() {
        const score = parseFloat(document.getElementById('customScore').value);

        if (isNaN(score) || score < 0 || score > 10) {
            alert('Ingresa una puntuación válida entre 0 y 10');
            return;
        }

        const rec = this.recommendations[this.currentEditStreamer].find(
            r => r.movieId === this.currentEditMovie
        );

        if (rec) {
            const oldScore = rec.customScore || rec.movieData.vote_average;
            rec.customScore = score;
            rec.movieData.vote_average = score;

            this.saveRecommendations();
            this.logAction(
                'Puntuación Modificada',
                `Película: ${rec.movieData.title} | Streamer: ${this.currentEditStreamer} | ${oldScore.toFixed(1)} → ${score.toFixed(1)}`
            );

            this.loadDashboard();
            this.closeEditModal();

            alert('Puntuación actualizada correctamente');
        }
    }

    // Close edit modal
    closeEditModal() {
        document.getElementById('editScoreModal').style.display = 'none';
        this.currentEditMovie = null;
        this.currentEditStreamer = null;
    }

    // Delete recommendation
    deleteRecommendation(streamer, movieId, movieTitle) {
        if (!confirm(`¿Estás seguro de que quieres eliminar "${movieTitle}"?`)) {
            return;
        }

        const recs = this.recommendations[streamer];
        const index = recs.findIndex(r => r.movieId === movieId);

        if (index !== -1) {
            recs.splice(index, 1);

            // Remove streamer if no more recommendations
            if (recs.length === 0) {
                delete this.recommendations[streamer];
            }

            this.saveRecommendations();
            this.logAction(
                'Recomendación Eliminada',
                `Película: ${movieTitle} | Streamer: ${streamer}`
            );

            this.loadDashboard();
            alert('Recomendación eliminada correctamente');
        }
    }
}

// Global functions
function closeEditModal() {
    window.adminDashboard.closeEditModal();
}

function saveCustomScore() {
    window.adminDashboard.saveCustomScore();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adminDashboard = new AdminDashboard();
    });
} else {
    window.adminDashboard = new AdminDashboard();
}
