# Learn

## Developer notes

- fast build Qursus app for equal wamp installation from wsl debian
  ```bash
  npm run build && npm run webpack && cp -r qursus.bundle.js export/ && rm -f web.app && zip -r ./web.app * && cp web.app /mnt/c/wamp64/www/equal/packages/learn/apps/qursus/ && rm -rf /mnt/c/wamp64/www/equal/public/qursus && cp -r export /mnt/c/wamp64/www/equal/public/qursus
  ```

Check the typescript syntax (lint):

`yarn run tsc`

Use babel to transpile .ts file into .js :

`npm run build`

Generate an app.bundle.js that can be embedded to any .html file:

`npm run webpack`