import fs from 'fs/promises';
import path from 'path';

// La directory di output che Vercel userà
const outputDir = 'dist';

async function build() {
  try {
    console.log('Starting build process...');

    // 1. Legge la variabile d'ambiente fornita da Vercel
    // Usa un URL di fallback se la variabile non è impostata (utile per test locali)
    const apiUrl = process.env.PUBLIC_API_URL || 'http://localhost:12000';
    console.log(`Using API URL: ${apiUrl}`);

    // 2. Assicura che la directory di output esista
    await fs.mkdir(outputDir, { recursive: true });

    // 3. Legge il contenuto del file HTML sorgente
    let htmlContent = await fs.readFile('index.html', 'utf-8');

    // 4. Sostituisce il placeholder con la URL dell'API reale
    htmlContent = htmlContent.replace('__API_URL__', apiUrl);
    console.log('Placeholder __API_URL__ has been replaced.');

    // 5. Scrive il nuovo file HTML nella directory di output
    const outputPath = path.join(outputDir, 'index.html');
    await fs.writeFile(outputPath, htmlContent, 'utf-8');
    console.log(`Build successful! Output written to ${outputPath}`);

  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1); // Esce con un codice di errore per far fallire la build di Vercel
  }
}

build();