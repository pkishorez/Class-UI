# !/bin/sh

rm -r ./Components
rm -r ./Helper
rm -r ./docs
rm ./ClassUI.d.ts
rm ./ClassUI.js
rm ./Navbar.d.ts
rm ./Navbar.js
rm ./Content.d.ts
rm ./Content.js

tsc

npm version patch -m "patch"

npm publish

rm -r ./Components
rm -r ./Helper
rm -r ./docs
rm ./ClassUI.d.ts
rm ./ClassUI.js
rm ./Navbar.d.ts
rm ./Navbar.js
rm ./Content.d.ts
rm ./Content.js