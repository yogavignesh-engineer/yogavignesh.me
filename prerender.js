import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const ROUTES = ['/', '/project/1', '/project/2', '/blog/1']; // Add more routes as needed

async function prerender() {
    console.log('🚀 Starting Prerendering...');

    // 1. Start static server (e.g., vite preview)
    const server = spawn('npm', ['run', 'preview', '--', '--port', '4173'], {
        cwd: __dirname,
        shell: true,
        stdio: 'pipe' // pipe so we can listen for "Local:"
    });

    let serverUrl = '';

    // Wait for server to be ready
    await new Promise((resolve) => {
        server.stdout.on('data', (data) => {
            const output = data.toString();
            // Strip ANSI codes
            const cleanOutput = output.replace(/\u001b\[\d+m/g, '');
            console.log(`[Server] ${cleanOutput.trim()}`);
            const match = cleanOutput.match(/http:\/\/localhost:(\d+)/);
            if (match) {
                serverUrl = match[0];
                resolve();
            }
        });
        server.stderr.on('data', (data) => console.error(`[Server Error] ${data}`));
    });

    console.log(`✅ Server ready at ${serverUrl}`);

    // 2. Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport to desktop
    await page.setViewport({ width: 1920, height: 1080 });

    for (const route of ROUTES) {
        const url = `${serverUrl}${route}`;
        const filePath = path.join(DIST_DIR, route === '/' ? 'index.html' : `${route.replace('/', '')}/index.html`);
        const dirPath = path.dirname(filePath);

        console.log(`📸 Prerendering ${route}...`);

        try {
            // 1. Navigate
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // 2. Wait for root content explicitly
            await page.waitForSelector('#root > *', { timeout: 10000 });

            // 3. Hard wait to let initial entrance animations stabilize
            await new Promise(r => setTimeout(r, 5000));

            // Check if 404
            if (page.url().includes('404')) {
                console.warn(`⚠️ Route ${route} redirected to 404!`);
            }

            const content = await page.content();

            // Ensure dir exists
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            fs.writeFileSync(filePath, content);
            console.log(`💾 Saved ${filePath}`);

        } catch (e) {
            console.error(`❌ Failed to prerender ${route}:`, e);
        }
    }

    await browser.close();
    server.kill();
    console.log('✨ Prerendering Complete!');
    process.exit(0);
}

prerender();
