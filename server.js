import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import YouTubeTranscriptFetcher from './src/YouTubeTranscriptFetcher.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize transcript fetcher
let transcriptFetcher;
if (process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD) {
    transcriptFetcher = new YouTubeTranscriptFetcher(
        process.env.OXYLABS_USERNAME,
        process.env.OXYLABS_PASSWORD
    );
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    const hasCredentials = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);
    res.json({ 
        status: 'ok', 
        hasCredentials,
        timestamp: new Date().toISOString()
    });
});

// Transcript endpoint
app.post('/api/transcript', async (req, res) => {
    try {
        // Check if credentials are configured
        if (!transcriptFetcher) {
            return res.status(500).json({
                error: 'Oxylabs credentials not configured. Please set OXYLABS_USERNAME and OXYLABS_PASSWORD in your .env file.'
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
                error: 'Invalid video ID format'
            });
        }

        console.log(`Fetching transcript for video: ${videoId}, language: ${language}, origin: ${origin}`);

        // Fetch transcript
        const transcript = await transcriptFetcher.getTranscriptText(videoId, language, origin);

        // Calculate some stats
        const lines = transcript.split('\n').filter(line => line.trim());
        const wordCount = transcript.split(/\s+/).length;
        const duration = lines.length > 0 ? 
            lines[lines.length - 1].match(/^\[(\d+)s\]/)?.[1] || 0 : 0;

        res.json({
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
            }
        });

    } catch (error) {
        console.error('Transcript fetch error:', error.message);
        
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
            videoId: req.body.videoId
        });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve API documentation
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'api-docs.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser`);
    
    if (!process.env.OXYLABS_USERNAME || !process.env.OXYLABS_PASSWORD) {
        console.log('⚠️  Warning: Oxylabs credentials not found in .env file');
        console.log('   Please set OXYLABS_USERNAME and OXYLABS_PASSWORD');
    } else {
        console.log('✅ Oxylabs credentials loaded');
    }
});

export default app;