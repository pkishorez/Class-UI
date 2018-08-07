# !/bin/sh

./clean.sh
npm run compile

npm version patch -m "patch"

npm publish

./clean.sh