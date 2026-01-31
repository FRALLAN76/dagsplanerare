/**
 * OpenSymbols API Proxy Server
 * 
 * This server securely handles authentication with OpenSymbols API,
 * keeping the shared secret safe on the server side.
 * 
 * Usage:
 *   1. Set your secret: export OPENSYMBOLS_SECRET=your_secret_here
 *   2. Run: node server.js
 *   3. The proxy will be available at http://localhost:3001
 */

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 3001;
const OPENSYMBOLS_SECRET = process.env.OPENSYMBOLS_SECRET || 'c4b6bf27cd5a97dece252a2e';
const OPENSYMBOLS_API = 'https://www.opensymbols.org';

// Token cache
let accessToken = null;
let tokenExpires = null;

// MIME types for static file serving
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

/**
 * Make HTTPS request
 */
function httpsRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

/**
 * Get or refresh access token
 */
async function getAccessToken() {
    // Check if we have a valid cached token
    if (accessToken && tokenExpires && new Date() < new Date(tokenExpires)) {
        return accessToken;
    }

    console.log('Fetching new access token...');
    
    try {
        const response = await httpsRequest({
            hostname: 'www.opensymbols.org',
            path: `/api/v2/token?secret=${OPENSYMBOLS_SECRET}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 && response.data.access_token) {
            accessToken = response.data.access_token;
            tokenExpires = response.data.expires;
            console.log('Access token obtained, expires:', tokenExpires);
            return accessToken;
        } else {
            console.error('Failed to get token:', response);
            throw new Error('Failed to obtain access token');
        }
    } catch (error) {
        console.error('Token request error:', error);
        throw error;
    }
}

/**
 * Search symbols via OpenSymbols API
 */
async function searchSymbols(query, locale = 'en', safe = '1') {
    const token = await getAccessToken();
    
    const searchPath = `/api/v2/symbols?q=${encodeURIComponent(query)}&locale=${locale}&safe=${safe}&access_token=${encodeURIComponent(token)}`;
    
    console.log(`Searching: ${query} (locale: ${locale})`);
    
    const response = await httpsRequest({
        hostname: 'www.opensymbols.org',
        path: searchPath,
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Handle token expiration
    if (response.status === 401 && response.data.token_expired) {
        console.log('Token expired, refreshing...');
        accessToken = null;
        tokenExpires = null;
        return searchSymbols(query, locale, safe); // Retry with new token
    }

    if (response.status === 429) {
        console.warn('Rate limited by OpenSymbols');
        throw new Error('Rate limited');
    }

    return response.data;
}

/**
 * Serve static files
 */
function serveStaticFile(res, filePath) {
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

/**
 * Main server
 */
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API endpoint: /api/symbols
    if (pathname === '/api/symbols') {
        const query = parsedUrl.query.q;
        const locale = parsedUrl.query.locale || 'en';
        const safe = parsedUrl.query.safe || '1';

        if (!query) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing query parameter "q"' }));
            return;
        }

        try {
            const symbols = await searchSymbols(query, locale, safe);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(symbols));
        } catch (error) {
            console.error('Search error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // API health check
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'ok', 
            hasToken: !!accessToken,
            tokenExpires: tokenExpires
        }));
        return;
    }

    // Serve static files
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    serveStaticFile(res, filePath);
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         Dagsplanerare - OpenSymbols Proxy Server           ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Server running at: http://localhost:${PORT}                 ║
║                                                            ║
║  Endpoints:                                                ║
║    GET /              - Main application                   ║
║    GET /api/symbols   - Symbol search proxy                ║
║        ?q=search      - Search query (required)            ║
║        &locale=sv     - Language (default: en)             ║
║        &safe=1        - Safe search (default: 1)           ║
║    GET /api/health    - Health check                       ║
║                                                            ║
║  Press Ctrl+C to stop                                      ║
╚════════════════════════════════════════════════════════════╝
`);
});
