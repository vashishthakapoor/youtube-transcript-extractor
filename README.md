# YouTube Transcript Fetcher

A Node.js application that fetches YouTube video transcripts using the Oxylabs Web Scraper API. This tool allows you to extract both uploader-provided and auto-generated transcripts from YouTube videos in multiple languages.

## Features

- 🎥 Fetch transcripts from YouTube videos using video URLs or IDs
- 🌍 Support for multiple languages (en, es, fr, de, etc.)
- 📝 Get both uploader-provided and auto-generated transcripts
- 💾 Save transcripts to text files
- 🔧 Interactive command-line interface
- 📊 Raw API response access for advanced usage

## Prerequisites

- Node.js 16+ 
- Oxylabs account with Web Scraper API access
- Valid Oxylabs username and password

## Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

4. Edit the `.env` file and add your Oxylabs credentials:

```env
OXYLABS_USERNAME=your_username_here
OXYLABS_PASSWORD=your_password_here
```

## Usage

### Web Interface (Recommended)

Start the web server:

```bash
npm start
```

Then open your browser to `http://localhost:3000` for a beautiful web interface with:

- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 🔍 **Real-time Search** - Search through transcripts with highlighting
- 📱 **Mobile Friendly** - Works perfectly on all devices
- 💾 **Export Options** - Copy to clipboard or download as file
- 🌍 **Multi-language** - Support for 10+ languages
- ⚡ **Fast & Smooth** - Optimized performance with loading states

### Command Line Interface

Run the CLI version:

```bash
npm run cli
```

Follow the prompts to:
1. Enter a YouTube video URL or ID
2. Choose language code (default: 'en')
3. Select transcript origin (uploader-provided or auto-generated)
4. Optionally save the transcript to a file

### Programmatic Usage

Import and use the `YouTubeTranscriptFetcher` class in your code:

```javascript
import YouTubeTranscriptFetcher from './src/YouTubeTranscriptFetcher.js';

const fetcher = new YouTubeTranscriptFetcher(
    'your_username',
    'your_password'
);

// Fetch transcript text
const transcript = await fetcher.getTranscriptText(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'en',
    'uploader_provided'
);

console.log(transcript);

// Get raw API response
const rawData = await fetcher.fetchTranscript(
    'dQw4w9WgXcQ',
    'en',
    'auto_generated'
);

console.log(JSON.stringify(rawData, null, 2));
```

### Supported Input Formats

The application accepts various YouTube URL formats and video IDs:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`
- `VIDEO_ID` (11-character video ID directly)

## API Parameters

### Language Codes

Common language codes supported:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese

### Transcript Origins

- `uploader_provided` - Transcripts provided by the video uploader
- `auto_generated` - Auto-generated transcripts by YouTube

## Examples

### Quick Example

Run the simple example:

```bash
node example-simple.js
```

### Detailed Examples

See `src/examples.js` for detailed usage examples:

```bash
node -e "import('./src/examples.js').then(m => m.examples())"
```

## Error Handling

The application handles various error scenarios:

- **Invalid credentials**: Check your Oxylabs username and password
- **Invalid video URL/ID**: Ensure the YouTube URL or video ID is correct
- **Network errors**: Check your internet connection
- **API rate limits**: Wait before making additional requests
- **No transcript available**: Try different language codes or transcript origins

## Debugging

If you encounter issues, you can enable debug mode by setting the `DEBUG` environment variable:

```bash
DEBUG=1 npm start
```

This will show detailed API responses to help troubleshoot any problems.

## Development

### Web Server Development

Run the web server in development mode with auto-reload:

```bash
npm run dev
```

### CLI Development  

Run the CLI in development mode:

```bash
npm run dev:cli
```

## Project Structure

```
yt-transcript/
├── public/
│   ├── index.html                  # Web interface
│   └── api-docs.html              # API documentation
├── src/
│   ├── index.js                    # CLI application
│   ├── YouTubeTranscriptFetcher.js # Core transcript fetcher class
│   └── examples.js                 # Usage examples
├── server.js                       # Express.js web server
├── Dockerfile                      # Docker configuration
├── docker-compose.yml              # Docker Compose setup
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Project dependencies and scripts
└── README.md                       # This file
```

## API Reference

### YouTubeTranscriptFetcher Class

#### Constructor

```javascript
new YouTubeTranscriptFetcher(username, password)
```

#### Methods

- `extractVideoId(input)` - Extract video ID from URL or validate video ID
- `fetchTranscript(videoInput, languageCode, transcriptOrigin)` - Get raw transcript data
- `getTranscriptText(videoInput, languageCode, transcriptOrigin)` - Get formatted transcript text
- `getAvailableLanguages(videoInput)` - Get available transcript languages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For Oxylabs API issues, contact [Oxylabs support](https://oxylabs.io/contact).

For application issues, please create an issue in this repository.

## Disclaimer

This application is for educational and legitimate research purposes. Always respect YouTube's Terms of Service and the content creators' rights. Ensure you have proper authorization before extracting content from videos.

## Deployment

### Docker Deployment

Build and run with Docker:

```bash
docker build -t youtube-transcript .
docker run -p 3000:3000 --env-file .env youtube-transcript
```

Or use Docker Compose:

```bash
docker-compose up -d
```

### Manual Deployment

1. Install dependencies: `npm install --production`
2. Set environment variables
3. Start the server: `npm start`
4. Access the application at `http://localhost:3000`

## API Endpoints

- `GET /` - Web interface
- `GET /docs` - API documentation  
- `GET /api/health` - Health check
- `POST /api/transcript` - Fetch transcript

For detailed API documentation, visit `/docs` when the server is running.