#!/bin/bash
set -e

echo "Building Vite client..."
npx vite build

echo "Copying img assets..."
cp -r client/src/assets/img dist/public/img

echo "Copying server and shared into api/..."
rm -rf api/server api/shared
cp -r server api/server
cp -r shared api/shared

echo "Fixing import paths in api/server files..."
# server/db.ts: ../shared/schema -> ../shared/schema (already correct relative to api/server/)
# server/storage.ts: ../shared/schema -> ../shared/schema (correct)  
# server/replit_integrations/auth/storage.ts: ../../../shared -> ../../shared

# Fix paths that reference shared/ from within api/server/
find api/server -name "*.ts" -exec sed -i 's|from "\.\./\.\./\.\./shared/|from "../../shared/|g' {} \;
find api/server -name "*.ts" -exec sed -i 's|from "\.\./shared/|from "../../shared/|g' {} \;
find api/server -name "*.ts" -exec sed -i 's|from "@shared/|from "../../shared/|g' {} \;

echo "Build complete!"
