#!/bin/sh
set -e
rm -rf mx-server-core
mkdir mx-server-core
cp -r ./apps/core/out ./mx-server-core/out

# Copy core ecosystem.config.js to $root/mx-server-core
cp ./apps/core/ecosystem.config.js mx-server-core
zip -r ./mx-server-core.zip mx-server-core
