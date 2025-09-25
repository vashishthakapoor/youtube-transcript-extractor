import YouTubeTranscriptFetcher from './YouTubeTranscriptFetcher.js';
import readline from 'readline';

// Initialize the transcript fetcher
const transcriptFetcher = new YouTubeTranscriptFetcher(
    process.env.OXYLABS_USERNAME,
    process.env.OXYLABS_PASSWORD
);

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function main() {
    console.log('🎥 YouTube Transcript Fetcher');
    console.log('===========================\n');

    // Check if credentials are provided
    if (!process.env.OXYLABS_USERNAME || !process.env.OXYLABS_PASSWORD) {
        console.error('❌ Error: Oxylabs credentials not found!');
        console.log('Please create a .env file with your Oxylabs credentials:');
        console.log('OXYLABS_USERNAME=your_username');
        console.log('OXYLABS_PASSWORD=your_password');
        process.exit(1);
    }

    try {
        // Get video URL/ID from user
        const videoInput = await askQuestion('Enter YouTube video URL or ID: ');
        
        if (!videoInput.trim()) {
            console.log('❌ No video URL/ID provided');
            rl.close();
            return;
        }

        // Get language preference
        const language = await askQuestion('Enter language code (default: en): ') || 'en';
        
        // Get transcript origin preference
        console.log('\nTranscript origin options:');
        console.log('1. uploader_provided (default)');
        console.log('2. auto_generated');
        const originChoice = await askQuestion('Choose transcript origin (1 or 2, default: 1): ') || '1';
        
        const transcriptOrigin = originChoice === '2' ? 'auto_generated' : 'uploader_provided';

        console.log('\n🔍 Fetching transcript...\n');

        // Fetch and display transcript
        const transcriptText = await transcriptFetcher.getTranscriptText(
            videoInput, 
            language, 
            transcriptOrigin
        );

        console.log('✅ Transcript fetched successfully!\n');
        console.log('📝 TRANSCRIPT:');
        console.log('==============\n');
        console.log(transcriptText);

        // Ask if user wants to save to file
        const saveToFile = await askQuestion('\nSave transcript to file? (y/n): ');
        
        if (saveToFile.toLowerCase() === 'y' || saveToFile.toLowerCase() === 'yes') {
            const fs = await import('fs');
            const videoId = transcriptFetcher.extractVideoId(videoInput);
            const filename = `transcript_${videoId}_${language}.txt`;
            
            fs.writeFileSync(filename, transcriptText);
            console.log(`✅ Transcript saved to ${filename}`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message.includes('API Error: 401')) {
            console.log('\n💡 This might be due to invalid credentials. Please check your Oxylabs username and password.');
        } else if (error.message.includes('Invalid YouTube URL')) {
            console.log('\n💡 Please provide a valid YouTube URL or video ID.');
        } else if (error.message.includes('No transcript data found')) {
            console.log('\n💡 Possible solutions:');
            console.log('   • Try switching to "auto_generated" transcript origin');
            console.log('   • Try a different language code (e.g., "en-US" instead of "en")');
            console.log('   • The video might not have transcripts available');
            console.log('   • Check if the video ID is correct: ' + videoInput);
        } else if (error.message.includes('No results found')) {
            console.log('\n💡 The API returned no results. This could mean:');
            console.log('   • The video doesn\'t exist or is private');
            console.log('   • No transcripts are available for this video');
            console.log('   • Try a different video to test your credentials');
        }
    } finally {
        rl.close();
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Goodbye!');
    rl.close();
    process.exit(0);
});

// Run the application
main().catch((error) => {
    console.error('Fatal error:', error);
    rl.close();
    process.exit(1);
});