const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));

const scores = {
    performance: report.categories.performance.score * 100,
    accessibility: report.categories.accessibility.score * 100,
    bestPractices: report.categories['best-practices'].score * 100,
    seo: report.categories.seo.score * 100,
};

console.log('--- LIGHTHOUSE SCORES ---');
console.log(JSON.stringify(scores, null, 2));

console.log('\n--- TOP OPPORTUNITIES ---');
const audits = report.audits;
const opportunities = Object.values(audits)
    .filter(a => a.score !== 1 && a.details && a.details.type === 'opportunity')
    .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
    .slice(0, 5)
    .map(a => ({
        id: a.id,
        title: a.title,
        savings: a.displayValue,
        description: a.description
    }));

console.log(JSON.stringify(opportunities, null, 2));

console.log('\n--- DIAGNOSTICS ---');
const diagnostics = ['largest-contentful-paint-element', 'layout-shift-elements', 'total-byte-weight'];
diagnostics.forEach(id => {
    if (audits[id]) {
        console.log(`\n[${id}]: ${audits[id].displayValue}`);
    }
});
