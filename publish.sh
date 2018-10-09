# !/bin/sh

npm run compile

cp package.json ./dist/package.json
cp -r ./assets/ ./dist/
cd dist
echo $PWD
# npm version patch -m "patch"
cp package.json ../package.json

# npm publish
cd ../

# Delete if you don't want dist folder.
# rm -r dist/