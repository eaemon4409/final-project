const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('  PACKAGING COMPARE ANYTHING EXTENSION FOR RELEASE  ');
console.log('====================================================\n');

const extDir = __dirname;
const rootDir = path.resolve(extDir, '..');
const distDir = path.join(extDir, 'dist');
const releaseDir = path.join(rootDir, 'release');
const zipFileName = 'compare-anything-extension-v1.0.0.zip';
const zipFilePath = path.join(releaseDir, zipFileName);

// 1. Verify build artifacts
console.log('1. Checking build artifacts in dist/...');
const requiredFiles = [
  path.join(distDir, 'manifest.json'),
  path.join(distDir, 'index.html'),
  path.join(distDir, 'results.html'),
  path.join(distDir, 'content-loader.js'),
  path.join(distDir, 'assets', 'background.js'),
  path.join(distDir, 'assets', 'content.js'),
  path.join(distDir, 'icons', 'icon16.png'),
  path.join(distDir, 'icons', 'icon48.png'),
  path.join(distDir, 'icons', 'icon128.png'),
];

for (const f of requiredFiles) {
  if (!fs.existsSync(f)) {
    console.error(`ERROR: Missing required file: ${f}`);
    process.exit(1);
  }
}
console.log('✓ All essential manifest, HTML, and icon files verified.');

// 2. Ensure release directory
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

// 3. Remove old zip if present
if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath);
}

// 4. Create ZIP package using PowerShell Compress-Archive
console.log('\n2. Creating release ZIP package...');
try {
  const psCmd = `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipFilePath}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });
} catch (err) {
  console.error('Failed to create ZIP package:', err.message);
  process.exit(1);
}

// 5. Verify ZIP package
if (fs.existsSync(zipFilePath)) {
  const stats = fs.statSync(zipFilePath);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`\n✓ Successfully created release package:`);
  console.log(`  Path: ${zipFilePath}`);
  console.log(`  Size: ${sizeKb} KB`);
  console.log('\nPackage is ready for upload to the Chrome Web Store Developer Dashboard!');
} else {
  console.error('ERROR: Zip file was not created.');
  process.exit(1);
}
