# !/bin/sh

rm -r ./Components
rm -r ./DataStructures
rm -r ./Helper
rm -r ./docs
rm ./ClassUI.d.ts
rm ./ClassUI.js
rm ./Navbar.d.ts
rm ./Navbar.js
rm ./Content.d.ts
rm ./Content.js
rm ./classui.tgz

tsc

npm pack

mv classui-* classui.tgz
cd ~/Dream/IIITN/
npm install ~/Dream/Class-UI/classui.tgz
cd ~/Dream/Class-UI/

rm -r ./Components
rm -r ./DataStructures
rm -r ./Helper
rm -r ./docs
rm ./ClassUI.d.ts
rm ./ClassUI.js
rm ./Navbar.d.ts
rm ./Navbar.js
rm ./Content.d.ts
rm ./Content.js
rm ./classui.tgz