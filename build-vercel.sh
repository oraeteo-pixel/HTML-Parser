#!/bin/bash
set -e
npx vite build
cp -r client/src/assets/img dist/public/img
npx esbuild api/index.ts --bundle --platform=node --format=esm --outfile=api/handler.mjs \
  --external:pg --external:@neondatabase/serverless \
  --external:express --external:express-session --external:passport \
  --external:connect-pg-simple --external:memorystore \
  --external:multer --external:xlsx --external:mime-types \
  --external:dotenv/config --external:ws --log-level=warning
echo "Build complete!"
