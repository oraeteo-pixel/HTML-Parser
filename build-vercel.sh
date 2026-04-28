#!/bin/bash
set -e

echo "Building Vite client..."
npx vite build

echo "Copying img assets..."
cp -r client/src/assets/img dist/public/img

echo "Bundling API into api/handler.js with esbuild..."
npx esbuild api/index.ts \
  --bundle \
  --platform=node \
  --format=esm \
  --outfile=api/handler.js \
  --external:pg \
  --external:@neondatabase/serverless \
  --external:express \
  --external:express-session \
  --external:passport \
  --external:connect-pg-simple \
  --external:memorystore \
  --external:multer \
  --external:xlsx \
  --external:mime-types \
  --external:dotenv/config \
  --external:ws \
  --log-level=warning

echo "Bundle size: $(wc -l < api/handler.js) lines"
echo "Build complete!"
