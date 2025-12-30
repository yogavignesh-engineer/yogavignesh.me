import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportPath = path.join(__dirname, 'lighthouse-v4.json');

try {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    const scores = {
        performance: report.categories.performance.score * 100,
        fcp: report.audits['first-contentful-paint'].displayValue,
        lcp: report.audits['largest-contentful-paint'].displayValue,
        tbt: report.audits['total-blocking-time'].displayValue,
        cls: report.audits['cumulative-layout-shift'].displayValue,
        speedIndex: report.audits['speed-index'].displayValue,
        bootupTime: report.audits['bootup-time'].displayValue,
        mainThreadWork: report.audits['mainthread-work-breakdown'].displayValue
    };

    console.log('--------------------------------------------------');
    console.log('🚀 Lighthouse Performance Report (Final)');
    console.log('--------------------------------------------------');
    console.log(`🏆 Performance Score: ${scores.performance.toFixed(0)}/100`);
    console.log(`⏱️  FCP: ${scores.fcp}`);
    console.log(`🖼️  LCP: ${scores.lcp}`);
    console.log(`⏳ TBT: ${scores.tbt}`);
    console.log(`📐 CLS: ${scores.cls}`);
    console.log(`⚡ Speed Index: ${scores.speedIndex}`);
    console.log(`📜 JS Execution Time: ${scores.bootupTime}`);
    console.log(`🧵 Main Thread Work: ${scores.mainThreadWork}`);
    console.log('--------------------------------------------------');

} catch (error) {
    console.error("❌ Error parsing Lighthouse report:", error.message);
}
