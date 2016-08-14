#!/usr/bin/env bash

npm run build
BRANCH_NAME=build_"$RANDOM"
git checkout -b $BRANCH_NAME
git add -f dist/*.min.js script.es5.js
git commit -m 'build'
git push --force origin $BRANCH_NAME:gh-pages
git checkout master
git branch -D $BRANCH_NAME