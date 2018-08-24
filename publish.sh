# !/bin/sh

./clean.sh
npm run compile

cp package.json ./dist/package.json
cd dist
npm version patch -m "patch"
cp package.json ../package.json

npm publish