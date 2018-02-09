#!/bin/bash

# build したものをデプロイしないと .gitignore してるリソースがデプロイされない
yarn build

rm -rf /tmp/build
cp -r build /tmp/build
cd /tmp/build

# https://stackoverflow.com/questions/29053830/gulp-deploy-dist-folder-of-node-app-to-heroku
echo '{ "root": "./" }' > static.json
heroku buildpacks:clear --app songtyping
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git --app songtyping

git init
git add .
git commit -m 'build'
git remote add heroku https://git.heroku.com/songtyping.git
git push -fu heroku master
