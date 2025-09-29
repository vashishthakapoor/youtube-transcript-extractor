import axios from 'axios';

class YouTubeTranscriptFetcher {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.apiUrl = 'https://realtime.oxylabs.io/v1/queries';
    }

    /**
     * Extract video ID from YouTube URL or return the ID if already provided
     * @param {string} input - YouTube URL or video ID
     * @returns {string} Video ID
     */
    extractVideoId(input) {
        // If it's already a video ID (11 characters, alphanumeric)
        if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
            return input;
        }

        // Extract from various YouTube URL formats
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
        ];

        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match) {
                return match[1];
            }
        }

        throw new Error('Invalid YouTube URL or video ID');
    }

    /**
     * Fetch transcript for a YouTube video
     * @param {string} videoInput - YouTube URL or video ID
     * @param {string} languageCode - Language code (e.g., 'en', 'es', 'fr')
     * @param {string} transcriptOrigin - 'uploader_provided' or 'auto_generated'
     * @returns {Promise<Object>} Transcript data
     */
    async fetchTranscript(videoInput, languageCode = 'en', transcriptOrigin = 'uploader_provided') {
        try {
            const videoId = this.extractVideoId(videoInput);
            
            const requestData = {
                source: 'youtube_transcript',
                query: videoId,
                context: [
                    {
                        key: 'language_code',
                        value: languageCode
                    },
                    {
                        key: 'transcript_origin',
                        value: transcriptOrigin
                    }
                ]
            };

            console.log(`Fetching transcript for video ID: ${videoId}`);
            console.log(`Language: ${languageCode}, Origin: ${transcriptOrigin}`);

            const response = await axios.post(this.apiUrl, requestData, {
                auth: {
                    username: this.username,
                    password: this.password
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            });

            // Log response for debugging (remove in production)
            if (process.env.DEBUG) {
                console.log('API Response:', JSON.stringify(response.data, null, 2));
            }

            return response.data;

        } catch (error) {
            if (error.response) {
                throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
            } else if (error.request) {
                throw new Error('Network Error: No response received from the API');
            } else {
                throw error;
            }
        }
    }

    /**
     * Parse Oxylabs YouTube transcript response format
     * @private
     */
    _parseOxylabsTranscript(content) {
        const transcriptItems = [];
        
        // content is an array-like object with numeric keys
        const contentArray = Object.values(content);
        
        for (const item of contentArray) {
            if (item && item.transcriptSegmentRenderer) {
                const segment = item.transcriptSegmentRenderer;
                const startMs = parseInt(segment.startMs) || 0;
                const startSeconds = Math.floor(startMs / 1000);
                
                // Extract text from snippet
                let text = '';
                if (segment.snippet && segment.snippet.runs) {
                    text = segment.snippet.runs.map(run => run.text).join('');
                }
                
                if (text.trim()) {
                    transcriptItems.push({
                        start: startSeconds,
                        text: text.trim()
                    });
                }
            }
        }
        
        return transcriptItems;
    }

    /**
     * Get transcript text in a readable format
     * @param {string} videoInput - YouTube URL or video ID
     * @param {string} languageCode - Language code
     * @param {string} transcriptOrigin - Transcript origin
     * @returns {Promise<string>} Formatted transcript text
     */
    async getTranscriptText(videoInput, languageCode = 'en', transcriptOrigin = 'uploader_provided') {
        try {
            const data = await this.fetchTranscript(videoInput, languageCode, transcriptOrigin);
            
            if (data && data.results && data.results.length > 0) {
                const result = data.results[0];
                
                // Check for different possible response structures
                if (result.content && result.content.transcript) {
                    return result.content.transcript
                        .map(item => `[${item.start}s] ${item.text}`)
                        .join('\n');
                } else if (result.content && result.content.transcripts) {
                    // Alternative structure
                    return result.content.transcripts
                        .map(item => `[${item.start}s] ${item.text}`)
                        .join('\n');
                } else if (result.transcript) {
                    // Direct transcript in results
                    return result.transcript
                        .map(item => `[${item.start}s] ${item.text}`)
                        .join('\n');
                } else if (result.content && typeof result.content === 'object') {
                    // Oxylabs format: content is an object with numeric keys containing transcriptSegmentRenderer
                    const transcriptItems = this._parseOxylabsTranscript(result.content);
                    if (transcriptItems.length > 0) {
                        return transcriptItems
                            .map(item => `[${item.start}s] ${item.text}`)
                            .join('\n');
                    }
                    
                    // Fallback: try to find transcript data in any nested structure
                    const transcriptData = this._findTranscriptData(result.content);
                    if (transcriptData) {
                        return transcriptData
                            .map(item => `[${item.start || item.time || '?'}s] ${item.text || item.content}`)
                            .join('\n');
                    }
                    
                    throw new Error(`No transcript data found in content. Available keys: ${JSON.stringify(Object.keys(result.content).slice(0, 10))}`);
                } else {
                    throw new Error(`Unexpected response structure. Result keys: ${JSON.stringify(Object.keys(result))}`);
                }
            } else {
                console.log('Full API response for debugging:');
                console.log(JSON.stringify(data, null, 2));
                throw new Error(`No results found for the video. Status: ${data.status || 'unknown'}`);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Helper method to find transcript data in various response structures
     * @private
     */
    _findTranscriptData(obj) {
        if (Array.isArray(obj)) {
            return obj;
        }
        
        for (const key in obj) {
            if (key.toLowerCase().includes('transcript') && Array.isArray(obj[key])) {
                return obj[key];
            }
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const found = this._findTranscriptData(obj[key]);
                if (found) return found;
            }
        }
        return null;
    }
}

export default YouTubeTranscriptFetcher;