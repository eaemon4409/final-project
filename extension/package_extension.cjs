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

const releaseZipName = 'Compare_Anything_Store_Release.zip';
const emonZipName = 'Emon_Ahmed_Extension.zip';

const releaseZipPath = path.join(releaseDir, releaseZipName);
const emonZipPath = path.join(releaseDir, emonZipName);

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

// 3. Remove old zips if present
[releaseZipPath, emonZipPath].forEach((z) => {
  if (fs.existsSync(z)) {
    fs.unlinkSync(z);
  }
});

// 4. Create ZIP packages using PowerShell Compress-Archive
console.log('\n2. Creating release ZIP packages...');
try {
  const psCmd = `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${emonZipPath}' -Force; Copy-Item -Path '${emonZipPath}' -Destination '${releaseZipPath}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });
} catch (err) {
  console.error('Failed to create ZIP package:', err.message);
  process.exit(1);
}

// 5. Copy to Desktop locations
const desktopLocations = [
  'C:\\Users\\Emon Ahmed\\OneDrive\\Desktop',
  'C:\\Users\\Emon Ahmed\\Desktop',
];

console.log('\n3. Copying packages to Desktop...');
desktopLocations.forEach((dest) => {
  if (fs.existsSync(dest)) {
    try {
      fs.copyFileSync(emonZipPath, path.join(dest, emonZipName));
      fs.copyFileSync(releaseZipPath, path.join(dest, releaseZipName));
      console.log(`✓ Copied packages to: ${dest}`);
    } catch (e) {
      console.warn(`Could not copy to ${dest}: ${e.message}`);
    }
  }
});

// 6. Output confirmation
if (fs.existsSync(releaseZipPath)) {
  const stats = fs.statSync(releaseZipPath);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`\n====================================================`);
  console.log(`✓ STORE PACKAGE READY: ${releaseZipName} (${sizeKb} KB)`);
  console.log(`✓ PERSONAL PACKAGE READY: ${emonZipName} (${sizeKb} KB)`);
  console.log(`====================================================`);
  console.log(`Ready for direct upload to Chrome Developer Dashboard!`);
} else {
  console.error('ERROR: Zip files were not created.');
  process.exit(1);
}
