// Main Application Logic
class StreamRecApp {
    constructor() {
        this.init();
    }

    init() {
        // Check for demo mode
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('demo') === 'true') {
            this.showDemoStreamer();
        }
    }

    showDemoStreamer() {
        // Redirect to demo streamer page
        window.location.href = 'pages/streamer.html?username=lemany01&demo=true';
    }
}

// Global function for test streamer button
function showTestStreamer() {
    window.location.href = 'pages/streamer.html?username=lemany01&demo=true';
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new StreamRecApp();
    });
} else {
    window.app = new StreamRecApp();
}
