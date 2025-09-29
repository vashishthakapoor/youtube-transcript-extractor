import YouTubeTranscriptFetcher from './_lib/YouTubeTranscriptFetcher.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed. Use POST.',
            method: req.method 
        });
    }

    try {
        // Check if credentials are configured
        if (!process.env.OXYLABS_USERNAME || !process.env.OXYLABS_PASSWORD) {
            console.error('Missing credentials:', {
                hasUsername: !!process.env.OXYLABS_USERNAME,
                hasPassword: !!process.env.OXYLABS_PASSWORD
            });
            return res.status(500).json({
                error: 'Oxylabs credentials not configured. Please set OXYLABS_USERNAME and OXYLABS_PASSWORD environment variables.'
            });
        }

        const { videoId, language = 'en', origin = 'auto_generated' } = req.body;

        if (!videoId) {
            return res.status(400).json({
                error: 'Video ID is required'
            });
        }

        // Validate video ID format
        if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            return res.status(400).json({
                error: 'Invalid video ID format. Must be 11 characters.'
            });
        }

        console.log(`Fetching transcript for video: ${videoId}, language: ${language}, origin: ${origin}`);

        // Initialize transcript fetcher
        const transcriptFetcher = new YouTubeTranscriptFetcher(
            process.env.OXYLABS_USERNAME,
            process.env.OXYLABS_PASSWORD
        );

        // Fetch transcript
        const transcript = await transcriptFetcher.getTranscriptText(videoId, language, origin);

        // Calculate some stats
        const lines = transcript.split('\n').filter(line => line.trim());
        const wordCount = transcript.split(/\s+/).length;
        const duration = lines.length > 0 ? 
            lines[lines.length - 1].match(/^\[(\d+)s\]/)?.[1] || 0 : 0;

        res.status(200).json({
            success: true,
            videoId,
            language,
            origin,
            transcript,
            stats: {
                segments: lines.length,
                words: wordCount,
                characters: transcript.length,
                duration: parseInt(duration)
            },
            deployment: 'vercel',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Transcript fetch error:', error.message);
        console.error('Error stack:', error.stack);
        
        let statusCode = 500;
        let errorMessage = error.message;

        // Handle specific error types
        if (error.message.includes('API Error: 401')) {
            statusCode = 401;
            errorMessage = 'Invalid Oxylabs credentials. Please check your username and password.';
        } else if (error.message.includes('API Error: 404')) {
            statusCode = 404;
            errorMessage = 'Video not found or transcript not available.';
        } else if (error.message.includes('Network Error')) {
            statusCode = 503;
            errorMessage = 'Network error. Please try again later.';
        } else if (error.message.includes('No transcript data found')) {
            statusCode = 404;
            errorMessage = 'No transcript available for this video. Try different language or transcript type.';
        }

        res.status(statusCode).json({
            error: errorMessage,
            videoId: req.body?.videoId || 'unknown',
            timestamp: new Date().toISOString()
        });
    }
}