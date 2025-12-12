// Authentication Module
class Auth {
    constructor() {
        this.currentUser = this.loadUser();
        this.initAuthListeners();
    }

    // Load user from localStorage
    loadUser() {
        const userJson = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return userJson ? JSON.parse(userJson) : null;
    }

    // Save user to localStorage
    saveUser(user) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
        this.currentUser = user;
        this.updateUI();
    }

    // Clear user data
    clearUser() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        this.currentUser = null;
        this.updateUI();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && CONFIG.ADMIN_USERS.includes(this.currentUser.username);
    }

    // Check if user is streamer
    isStreamer() {
        return this.currentUser && this.currentUser.isStreamer;
    }

    // Simulate Twitch OAuth login
    loginWithTwitch() {
        // In production, this would redirect to Twitch OAuth
        // For demo, we'll simulate with a prompt
        const username = prompt('Ingresa tu nombre de usuario de Twitch (Demo):');
        if (!username) return;

        const user = {
            id: 'twitch_' + Math.random().toString(36).substr(2, 9),
            username: username,
            displayName: username,
            avatar: `https://ui-avatars.com/api/?name=${username}&background=8B5CF6&color=fff`,
            platform: 'twitch',
            isStreamer: confirm('¿Eres un streamer?'),
            language: CONFIG.DEFAULT_LANGUAGE,
            adultFilter: CONFIG.DEFAULT_ADULT_FILTER,
        };

        this.saveUser(user);

        // If streamer, redirect to their page
        if (user.isStreamer) {
            window.location.href = `pages/streamer.html?username=${user.username}`;
        } else {
            alert('¡Bienvenido! Ahora puedes recomendar películas a tus streamers favoritos.');
            window.location.reload();
        }
    }

    // Simulate Kick OAuth login
    loginWithKick() {
        const username = prompt('Ingresa tu nombre de usuario de Kick (Demo):');
        if (!username) return;

        const user = {
            id: 'kick_' + Math.random().toString(36).substr(2, 9),
            username: username,
            displayName: username,
            avatar: `https://ui-avatars.com/api/?name=${username}&background=EC4899&color=fff`,
            platform: 'kick',
            isStreamer: confirm('¿Eres un streamer?'),
            language: CONFIG.DEFAULT_LANGUAGE,
            adultFilter: CONFIG.DEFAULT_ADULT_FILTER,
        };

        this.saveUser(user);

        if (user.isStreamer) {
            window.location.href = `pages/streamer.html?username=${user.username}`;
        } else {
            alert('¡Bienvenido! Ahora puedes recomendar películas a tus streamers favoritos.');
            window.location.reload();
        }
    }

    // Simulate Discord OAuth login
    loginWithDiscord() {
        const username = prompt('Ingresa tu nombre de usuario de Discord (Demo):');
        if (!username) return;

        const user = {
            id: 'discord_' + Math.random().toString(36).substr(2, 9),
            username: username,
            displayName: username,
            avatar: `https://ui-avatars.com/api/?name=${username}&background=5865F2&color=fff`,
            platform: 'discord',
            isStreamer: false, // Discord users are viewers only
            language: CONFIG.DEFAULT_LANGUAGE,
            adultFilter: CONFIG.DEFAULT_ADULT_FILTER,
        };

        this.saveUser(user);
        alert('¡Bienvenido! Ahora puedes recomendar películas a tus streamers favoritos.');
        window.location.reload();
    }

    // Logout
    logout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            this.clearUser();
            window.location.href = '/index.html';
        }
    }

    // Update UI based on auth state
    updateUI() {
        const authBtn = document.getElementById('authBtn');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const myPageLink = document.getElementById('myPageLink');
        const adminLink = document.getElementById('adminLink');

        if (!authBtn) return;

        if (this.isLoggedIn()) {
            // Show user info
            if (userInfo && userName && userAvatar) {
                userInfo.style.display = 'flex';
                userName.textContent = this.currentUser.displayName;
                userAvatar.src = this.currentUser.avatar;
            }

            // Update auth button
            authBtn.textContent = 'Cerrar Sesión';
            authBtn.onclick = () => this.logout();
            authBtn.classList.remove('btn-primary');
            authBtn.classList.add('btn-secondary');

            // Show my page link if streamer
            if (this.isStreamer() && myPageLink) {
                myPageLink.style.display = 'block';
                myPageLink.href = `pages/streamer.html?username=${this.currentUser.username}`;
            }

            // Show admin link if admin
            if (this.isAdmin() && adminLink) {
                adminLink.style.display = 'block';
                adminLink.href = 'pages/admin.html';
            }
        } else {
            // Hide user info
            if (userInfo) userInfo.style.display = 'none';

            // Update auth button
            authBtn.textContent = 'Iniciar Sesión';
            authBtn.onclick = () => showAuthModal();
            authBtn.classList.add('btn-primary');
            authBtn.classList.remove('btn-secondary');

            // Hide links
            if (myPageLink) myPageLink.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
        }
    }

    // Initialize auth state listeners
    initAuthListeners() {
        // Update UI on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateUI());
        } else {
            this.updateUI();
        }
    }
}

// Create global auth instance
window.auth = new Auth();

// Global auth functions
function showAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'block';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
}

function loginWithTwitch() {
    closeAuthModal();
    window.auth.loginWithTwitch();
}

function loginWithKick() {
    closeAuthModal();
    window.auth.loginWithKick();
}

function loginWithDiscord() {
    closeAuthModal();
    window.auth.loginWithDiscord();
}
