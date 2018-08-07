# !/bin/sh

rm -r ./Components
rm -r ./DataStructures
rm -r ./Helper
rm -r ./docs
rm -r ./Emotion
rm -r ./Overlay
rm ./ClassUI.d.ts
rm ./ClassUI.js
rm ./Navbar.d.ts
rm ./Navbar.js
rm ./index.js
rm ./index.d.ts

npm run compile

npm version patch -m "patch"

npm publish

rm -r ./Components
rm -r ./DataStructures
rm -r ./Helper
rm -r ./docs
rm -r ./Emotion
rm -r ./Overlay
rm ./ClassUI.d.ts
rm ./ClassUI.js
rm ./Navbar.d.ts
rm ./Navbar.js
rm ./index.js
rm ./index.d.ts