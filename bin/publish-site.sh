#!/usr/bin/env bash

npm run build
BRANCH_NAME=$RANDOM
git checkout -b $BRANCH_NAME
git add -f dist lib script.es5.js
git commit -m 'build'
git push origin $BRANCH_NAME:gh-pages
git checkout master
git branch -D $BRANCH_NAME