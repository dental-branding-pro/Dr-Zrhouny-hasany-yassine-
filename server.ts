import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Security headers & hygiene
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Serve static demo guide files directly without X-Frame-Options restriction
  const demoGuideDir = path.resolve(__dirname, 'public/demo-guide');
  app.use(
    '/demo-guide',
    (req, res, next) => {
      // Explicitly allow framing for live simulator preview
      res.removeHeader('X-Frame-Options');
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.setHeader('Content-Security-Policy', "frame-ancestors * 'self'");
      next();
    },
    express.static(demoGuideDir)
  );

  // Serve audio files with explicit CORS, Range, and framing support
  const audioDir = path.resolve(__dirname, 'public/audio');
  app.use(
    '/audio',
    (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Accept-Ranges', 'bytes');
      res.removeHeader('X-Frame-Options');
      next();
    },
    express.static(audioDir)
  );

  // Serve general public folder
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development mode, mount Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dental Branding Pro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
