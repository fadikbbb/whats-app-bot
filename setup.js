// setup.js - Alternative setup for Windows
const { execSync } = require('child_process');

console.log('🔧 Setting up WhatsApp bot for Windows...');

// Check if Chrome is installed
try {
    execSync('where chrome', { stdio: 'ignore' });
    console.log('✅ Chrome found in system PATH');
} catch (error) {
    console.log('❌ Chrome not found in PATH. Please install Google Chrome.');
    console.log('🌐 Download from: https://www.google.com/chrome/');
}