# Learn

## Developer notes

I think than the best worflow for qursus will be to use the application like this:

1. The user create à basic page in one click
    1. The user have two choices:
        1. Modify the freshly created page.
        2. Create maybe a new Leaf.

           Here the behavior is the same as the first choice à leaf with default content options is created.

        - like 1.1. Same for Page Leaf Group Widget.

### Todo:

- [ ] Create a new Page
    - [ ] Verify the behavior of the page.
    - [ ] Verify the behavior of the options


- [ ] Create a new Leaf
    - [ ] Verify the behavior of the page.
    - [ ] Verify the behavior of the options.


- [ ] Create a new Group
    - [ ] Verify the behavior of the page.
    - [ ] Verify the behavior of the options.

    
- [ ] Create a new Widget
    - [ ] Verify the behavior of the page.
    - [ ] Verify the behavior of the options.

### Scripts

- fast build Qursus app for equal wamp installation from wsl debian
  ```bash
  nvm use 14 && npm run build && npm run webpack && cp -r qursus.bundle.js export/ && rm -f web.app && zip -r ./web.app export/* && cp web.app /mnt/c/wamp64/www/equal/packages/learn/apps/qursus/ && rm -rf /mnt/c/wamp64/www/equal/public/qursus && cp -r export /mnt/c/wamp64/www/equal/public/qursus && cat web.app | md5sum | awk '{print $1}' > version && cp version /mnt/c/wamp64/www/equal/packages/learn/apps/qursus && cp manifest.json /mnt/c/wamp64/www/equal/packages/learn/apps/qursus && cp web.app /mnt/c/wamp64/www/equal/packages/learn/apps/qursus 
  ```

Check the typescript syntax (lint):

`yarn run tsc`

Use babel to transpile .ts file into .js :

`npm run build`

Generate an app.bundle.js that can be embedded to any .html file:

`npm run webpack`