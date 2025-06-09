import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// --- SETUP ---
// Load environment variables from .env file for local use
dotenv.config();

const outputDir = 'dist';

async function build() {
  try {
    console.log('Starting build process...');

    // 1. READ THE API URL FROM THE ENVIRONMENT
    // This will come from .env locally, or from Vercel's dashboard in production.
    const apiUrl = process.env.PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('ERROR: PUBLIC_API_URL environment variable is not set.');
    }
    console.log(`Using API URL: ${apiUrl}`);

    // 2. ENSURE THE OUTPUT DIRECTORY EXISTS
    await fs.mkdir(outputDir, { recursive: true });

    // 3. GENERATE vercel.json IN THE dist FOLDER
    const vercelConfig = {
      rewrites: [
        {
          "source": "/api/:path*",
          "destination": `${apiUrl}/:path*`
        }
      ]
    };
    await fs.writeFile(
      path.join(outputDir, 'vercel.json'),
      JSON.stringify(vercelConfig, null, 2)
    );
    console.log('Successfully generated dist/vercel.json');

    // 4. GENERATE serve.json IN THE dist FOLDER (for local preview)
    const serveConfig = {
      rewrites: [
        {
          "source": "/api/**",
          "destination": apiUrl
        }
      ]
    };
    await fs.writeFile(
      path.join(outputDir, 'serve.json'),
      JSON.stringify(serveConfig, null, 2)
    );
    console.log('Successfully generated dist/serve.json for local preview.');

    // 5. PROCESS index.html (this part remains the same)
    let htmlContent = await fs.readFile('index.html', 'utf-8');
    // We no longer need to replace a placeholder in the HTML since the API URL is just /api/process
    // But if you had other placeholders, this is where you'd do it.
    await fs.writeFile(path.join(outputDir, 'index.html'), htmlContent);
    console.log('Successfully processed index.html');

    // 6. COPY ASSETS
    const sourceAssetsDir = 'assets';
    const destAssetsDir = path.join(outputDir, sourceAssetsDir);
    await fs.mkdir(destAssetsDir, { recursive: true });
    await fs.copyFile(
      path.join(sourceAssetsDir, 'favicon.png'),
      path.join(destAssetsDir, 'favicon.png')
    );
    console.log('Successfully copied assets.');

    console.log('\nBuild complete! All files are in the /dist directory.');

  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1);
  }
}

build();