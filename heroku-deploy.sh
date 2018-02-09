#!/bin/bash

# build したものをデプロイしないと .gitignore してるリソースがデプロイされない
yarn build

rsync -a ./ /tmp/build --exclude='node_modules/' --exclude='.git/' --exclude='.idea/'
cd /tmp/build

# https://stackoverflow.com/questions/29053830/gulp-deploy-dist-folder-of-node-app-to-heroku
heroku buildpacks:clear --app songtyping
heroku buildpacks:set heroku/nodejs --app songtyping

git init
git add .
git add -f client/build
git commit -m 'build'
git remote add heroku https://git.heroku.com/songtyping.git
git push -fu heroku master
