# !/bin/sh

rm -r ./Components
rm -r ./DataStructures
rm -r ./Helper
rm -r ./docs
rm ./ClassUI.d.ts
rm ./ClassUI.js
rm ./Navbar.d.ts
rm ./Navbar.js
rm ./index.js
rm ./index.d.ts

echo "Compiling Typescript..."
tsc -p ./tsconfig.publish.json

echo "Packing Class-UI project."
yarn pack --filename classui.tgz

rm -r ./Components
rm -r ./DataStructures
rm -r ./Helper
rm -r ./docs
rm ./ClassUI.d.ts
rm ./ClassUI.js
rm ./Navbar.d.ts
rm ./Navbar.js
rm ./index.js
rm ./index.d.ts