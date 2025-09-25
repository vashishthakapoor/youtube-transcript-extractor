import YouTubeTranscriptFetcher from './YouTubeTranscriptFetcher.js';

// Example usage of the YouTube Transcript Fetcher
async function examples() {
    // Initialize with your Oxylabs credentials
    const fetcher = new YouTubeTranscriptFetcher(
        'your_username',
        'your_password'
    );

    try {
        console.log('Example 1: Fetch transcript with video URL');
        
        // Example with YouTube URL
        const transcript1 = await fetcher.getTranscriptText(
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'en',
            'uploader_provided'
        );
        console.log('Transcript:', transcript1);

        console.log('\n' + '='.repeat(50) + '\n');

        console.log('Example 2: Fetch transcript with video ID');
        
        // Example with just video ID
        const transcript2 = await fetcher.getTranscriptText(
            'dQw4w9WgXcQ',
            'en',
            'auto_generated'
        );
        console.log('Transcript:', transcript2);

        console.log('\n' + '='.repeat(50) + '\n');

        console.log('Example 3: Get raw response data');
        
        // Get full response data
        const rawData = await fetcher.fetchTranscript(
            'dQw4w9WgXcQ',
            'en',
            'uploader_provided'
        );
        console.log('Raw API Response:', JSON.stringify(rawData, null, 2));

    } catch (error) {
        console.error('Error in examples:', error.message);
    }
}

// Advanced usage example
async function advancedExample() {
    const fetcher = new YouTubeTranscriptFetcher(
        process.env.OXYLABS_USERNAME,
        process.env.OXYLABS_PASSWORD
    );

    const videoId = 'dQw4w9WgXcQ';

    try {
        console.log('Advanced Example: Try different languages and origins');

        // Try different combinations
        const combinations = [
            { lang: 'en', origin: 'uploader_provided' },
            { lang: 'en', origin: 'auto_generated' },
            { lang: 'es', origin: 'auto_generated' },
            { lang: 'fr', origin: 'auto_generated' }
        ];

        for (const combo of combinations) {
            try {
                console.log(`\nTrying ${combo.lang} (${combo.origin})...`);
                
                const transcript = await fetcher.getTranscriptText(
                    videoId,
                    combo.lang,
                    combo.origin
                );
                
                console.log(`✅ Success! Preview: ${transcript.substring(0, 100)}...`);
                
            } catch (error) {
                console.log(`❌ Failed: ${error.message}`);
            }
        }

        // Get available languages
        console.log('\nFetching available languages...');
        const languages = await fetcher.getAvailableLanguages(videoId);
        console.log('Available languages:', languages);

    } catch (error) {
        console.error('Error in advanced example:', error.message);
    }
}

export { examples, advancedExample };