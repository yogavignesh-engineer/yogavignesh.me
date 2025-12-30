import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#050505"/>
  <rect x="40" y="40" width="432" height="432" stroke="#66FCF1" stroke-width="4" fill="none"/>
  <rect x="60" y="60" width="392" height="392" stroke="#66FCF1" stroke-width="2" fill="none" opacity="0.5"/>
  <path d="M40 40L80 40L80 44L44 44L44 80L40 80Z" fill="#66FCF1"/>
  <path d="M472 40L472 80L468 80L468 44L432 44L432 40Z" fill="#66FCF1"/>
  <path d="M40 472L40 432L44 432L44 468L80 468L80 472Z" fill="#66FCF1"/>
  <path d="M472 472L432 472L432 468L468 468L468 432L472 432Z" fill="#66FCF1"/>
  <g transform="translate(256, 256)">
    <path d="M-50,-80 L-20,-80 L0,-40 L20,-80 L50,-80 L20,-20 L20,80 L-20,80 L-20,-20 Z" 
          fill="#66FCF1" 
          stroke="#FFCC00" 
          stroke-width="2"/>
    <circle cx="-30" cy="-70" r="4" fill="#FFCC00"/>
    <circle cx="30" cy="-70" r="4" fill="#FFCC00"/>
    <circle cx="10" cy="60" r="4" fill="#FFCC00"/>
    <circle cx="-10" cy="60" r="4" fill="#FFCC00"/>
    <line x1="-10" y1="-30" x2="-10" y2="70" stroke="#050505" stroke-width="2"/>
    <line x1="10" y1="-30" x2="10" y2="70" stroke="#050505" stroke-width="2"/>
  </g>
  <circle cx="120" cy="120" r="6" fill="none" stroke="#66FCF1" stroke-width="2" opacity="0.6"/>
  <circle cx="392" cy="120" r="6" fill="none" stroke="#66FCF1" stroke-width="2" opacity="0.6"/>
  <circle cx="120" cy="392" r="6" fill="none" stroke="#66FCF1" stroke-width="2" opacity="0.6"/>
  <circle cx="392" cy="392" r="6" fill="none" stroke="#66FCF1" stroke-width="2" opacity="0.6"/>
  <line x1="120" y1="126" x2="120" y2="180" stroke="#66FCF1" stroke-width="1" opacity="0.4"/>
  <line x1="392" y1="126" x2="392" y2="180" stroke="#66FCF1" stroke-width="1" opacity="0.4"/>
  <line x1="120" y1="332" x2="120" y2="386" stroke="#66FCF1" stroke-width="1" opacity="0.4"/>
  <line x1="392" y1="332" x2="392" y2="386" stroke="#66FCF1" stroke-width="1" opacity="0.4"/>
</svg>`;

const sizes = [
  { size: 512, name: 'icon-512x512.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

console.log('🎨 Generating PWA Icons with Sharp...\n');

async function generateIcons() {
  const buffer = Buffer.from(svgContent);
  
  for (const { size, name } of sizes) {
    const outputPath = join(__dirname, 'public', name);
    
    await sharp(buffer)
      .resize(size, size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`✅ Created ${name} (${size}x${size})`);
  }
  
  console.log('\n🏆 All PWA icons generated successfully!');
}

generateIcons().catch(console.error);
