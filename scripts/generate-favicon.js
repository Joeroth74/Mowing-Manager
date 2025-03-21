const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 16x16 canvas for the favicon
const canvas = createCanvas(16, 16);
const ctx = canvas.getContext('2d');

// Set background
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, 16, 16);

// Draw scissors icon
ctx.strokeStyle = '#22c55e'; // Green color matching the website theme
ctx.lineWidth = 2;

// Draw scissors blades
ctx.beginPath();
ctx.moveTo(4, 4);
ctx.lineTo(12, 12);
ctx.moveTo(12, 4);
ctx.lineTo(4, 12);
ctx.stroke();

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), buffer); 