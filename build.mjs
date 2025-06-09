import fs from 'fs/promises';
import path from 'path';

const outputDir = 'dist';

async function build() {
  try {
    console.log('Starting build process...');

    const apiUrl = process.env.PUBLIC_API_URL || 'http://localhost:12000';
    console.log(`Using API URL: ${apiUrl}`);

    await fs.mkdir(outputDir, { recursive: true });

    let htmlContent = await fs.readFile('index.html', 'utf-8');
    htmlContent = htmlContent.replace('__API_URL__', apiUrl);
    console.log('Placeholder __API_URL__ has been replaced.');

    const outputPath = path.join(outputDir, 'index.html');
    await fs.writeFile(outputPath, htmlContent, 'utf-8');
    console.log(`Build successful! Output written to ${outputPath}`);

    // --- MODIFIED: Asset Handling ---

    // NUOVO: Definisci la directory degli asset di origine e di destinazione
    const sourceAssetsDir = 'assets';
    const destAssetsDir = path.join(outputDir, sourceAssetsDir);

    // NUOVO: Assicura che la directory degli asset di destinazione esista
    await fs.mkdir(destAssetsDir, { recursive: true });
    console.log(`Ensured destination assets directory exists at: ${destAssetsDir}`);

    // MODIFICATO: Copia il favicon usando i nuovi percorsi
    const faviconName = 'favicon.png';
    const sourceFaviconPath = path.join(sourceAssetsDir, faviconName);
    const destFaviconPath = path.join(destAssetsDir, faviconName);

    console.log(`Copying ${sourceFaviconPath} to ${destFaviconPath}...`);
    await fs.copyFile(sourceFaviconPath, destFaviconPath);
    console.log('Favicon copied successfully.');


  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1);
  }
}

build();