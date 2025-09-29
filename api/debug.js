export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Debug information
    const debug = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body,
        environment: {
            NODE_ENV: process.env.NODE_ENV,
            hasOxylabsUsername: !!process.env.OXYLABS_USERNAME,
            hasOxylabsPassword: !!process.env.OXYLABS_PASSWORD,
            vercelRegion: process.env.VERCEL_REGION,
            vercelUrl: process.env.VERCEL_URL
        },
        timestamp: new Date().toISOString()
    };

    res.status(200).json(debug);
}