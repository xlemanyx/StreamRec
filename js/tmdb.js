// TMDb API Module
class TMDb {
    constructor() {
        this.apiKey = CONFIG.TMDB_API_KEY;
        this.baseUrl = CONFIG.TMDB_BASE_URL;
        this.imageBaseUrl = CONFIG.TMDB_IMAGE_BASE_URL;
        this.cache = new Map();
    }

    // Build API URL
    buildUrl(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        url.searchParams.append('api_key', this.apiKey);

        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });

        return url.toString();
    }

    // Get poster URL
    getPosterUrl(path, size = 'w500') {
        if (!path) return 'https://via.placeholder.com/500x750/1e1b4b/8B5CF6?text=No+Image';
        return `${this.imageBaseUrl}/${size}${path}`;
    }

    // Get backdrop URL
    getBackdropUrl(path, size = 'w1280') {
        if (!path) return 'https://via.placeholder.com/1280x720/1e1b4b/8B5CF6?text=No+Image';
        return `${this.imageBaseUrl}/${size}${path}`;
    }

    // Search movies
    async searchMovies(query, language = 'es', includeAdult = false, page = 1) {
        const cacheKey = `search_${query}_${language}_${includeAdult}_${page}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const url = this.buildUrl('/search/movie', {
                query,
                language,
                include_adult: includeAdult,
                page
            });

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to search movies');

            const data = await response.json();
            this.cache.set(cacheKey, data);

            return data;
        } catch (error) {
            console.error('Error searching movies:', error);
            return { results: [], total_results: 0 };
        }
    }

    // Get popular movies
    async getPopularMovies(language = 'es', includeAdult = false, page = 1) {
        const cacheKey = `popular_${language}_${includeAdult}_${page}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const url = this.buildUrl('/movie/popular', {
                language,
                include_adult: includeAdult,
                page
            });

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to get popular movies');

            const data = await response.json();
            this.cache.set(cacheKey, data);

            return data;
        } catch (error) {
            console.error('Error getting popular movies:', error);
            return { results: [], total_results: 0 };
        }
    }

    // Get movie details
    async getMovieDetails(movieId, language = 'es') {
        const cacheKey = `movie_${movieId}_${language}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const url = this.buildUrl(`/movie/${movieId}`, {
                language,
                append_to_response: 'videos,credits'
            });

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to get movie details');

            const data = await response.json();
            this.cache.set(cacheKey, data);

            return data;
        } catch (error) {
            console.error('Error getting movie details:', error);
            return null;
        }
    }

    // Get movie videos (trailers)
    async getMovieVideos(movieId, language = 'es') {
        try {
            const url = this.buildUrl(`/movie/${movieId}/videos`, { language });
            const response = await fetch(url);

            if (!response.ok) throw new Error('Failed to get movie videos');

            const data = await response.json();

            // Try to find a trailer in the requested language
            let trailer = data.results.find(v =>
                v.type === 'Trailer' && v.site === 'YouTube'
            );

            // If no trailer in requested language, try English
            if (!trailer && language !== 'en') {
                const urlEn = this.buildUrl(`/movie/${movieId}/videos`, { language: 'en' });
                const responseEn = await fetch(urlEn);

                if (responseEn.ok) {
                    const dataEn = await responseEn.json();
                    trailer = dataEn.results.find(v =>
                        v.type === 'Trailer' && v.site === 'YouTube'
                    );
                }
            }

            return trailer || null;
        } catch (error) {
            console.error('Error getting movie videos:', error);
            return null;
        }
    }

    // Get YouTube trailer URL
    getYouTubeUrl(videoKey, autoplay = true, mute = true) {
        if (!videoKey) return null;
        const params = new URLSearchParams({
            autoplay: autoplay ? '1' : '0',
            mute: mute ? '1' : '0',
            controls: '0',
            modestbranding: '1',
            rel: '0',
            showinfo: '0'
        });
        return `https://www.youtube.com/embed/${videoKey}?${params.toString()}`;
    }

    // Get top rated movies
    async getTopRatedMovies(language = 'es', includeAdult = false, page = 1) {
        try {
            const url = this.buildUrl('/movie/top_rated', {
                language,
                include_adult: includeAdult,
                page
            });

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to get top rated movies');

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting top rated movies:', error);
            return { results: [], total_results: 0 };
        }
    }

    // Get upcoming movies
    async getUpcomingMovies(language = 'es', includeAdult = false, page = 1) {
        try {
            const url = this.buildUrl('/movie/upcoming', {
                language,
                include_adult: includeAdult,
                page
            });

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to get upcoming movies');

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting upcoming movies:', error);
            return { results: [], total_results: 0 };
        }
    }

    // Get movie by genre
    async getMoviesByGenre(genreId, language = 'es', includeAdult = false, page = 1) {
        try {
            const url = this.buildUrl('/discover/movie', {
                with_genres: genreId,
                language,
                include_adult: includeAdult,
                page,
                sort_by: 'popularity.desc'
            });

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to get movies by genre');

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting movies by genre:', error);
            return { results: [], total_results: 0 };
        }
    }
}

// Create global TMDb instance
window.tmdb = new TMDb();
