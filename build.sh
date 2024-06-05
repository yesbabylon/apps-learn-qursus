#!/bin/bash
npm run build && npm run webpack
cp -r qursus.bundle.js export/
touch manifest.json && rm -f web.app && cd export && zip -r ../web.app * && cd ..
cat web.app | md5sum | awk '{print $1}' > version