import YouTubeTranscriptFetcher from './src/YouTubeTranscriptFetcher.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function simpleExample() {
    console.log('🎥 Simple YouTube Transcript Example');
    console.log('===================================\n');

    // Check credentials
    if (!process.env.OXYLABS_USERNAME || !process.env.OXYLABS_PASSWORD) {
        console.error('❌ Please set up your .env file with Oxylabs credentials');
        console.log('Copy .env.example to .env and add your credentials');
        process.exit(1);
    }

    // Initialize fetcher
    const fetcher = new YouTubeTranscriptFetcher(
        process.env.OXYLABS_USERNAME,
        process.env.OXYLABS_PASSWORD
    );

    try {
        // Example video ID - iPhone 17 Pro Max review
        const videoId = 'J1jm4MoZw5Y';
        
        console.log(`🔍 Fetching transcript for video: ${videoId}`);
        
        // Get transcript
        const transcript = await fetcher.getTranscriptText(videoId, 'en', 'auto_generated');
        
        console.log('✅ Success!');
        console.log(`📊 Transcript length: ${transcript.length} characters`);
        console.log(`📝 Number of segments: ${transcript.split('\n').length}`);
        
        console.log('\n📋 First few lines:');
        console.log('==================');
        const lines = transcript.split('\n');
        lines.slice(0, 10).forEach(line => console.log(line));
        
        console.log('\n🎉 Example completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message.includes('API Error: 401')) {
            console.log('\n💡 This appears to be an authentication issue.');
            console.log('   Please verify your Oxylabs username and password in the .env file.');
        }
    }
}

// Run the example
simpleExample();