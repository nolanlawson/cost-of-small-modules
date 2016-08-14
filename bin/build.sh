#!/usr/bin/env bash

PATH=$PATH:$(pwd)/node_modules/.bin

rimraf cjs-1000 es6-1000 dist
mkdirp cjs-1000 es6-1000 dist

echo "var total = 0" > cjs-1000/index.js
echo "var total = 0" > es6-1000/index.js

for ((i=0;i<1000;i++)); do
  echo "module.exports = ${i}" > cjs-1000/module_${i}.js
  echo "export default ${i}" > es6-1000/module_${i}.js
  echo "total += require('./module_${i}')" >> cjs-1000/index.js
  echo "import module_${i} from './module_${i}'" >> es6-1000/index.js
done

echo "console.log(total)" >> cjs-1000/index.js
echo "console.log(total)" >> es6-1000/index.js

browserify ./cjs-1000 > dist/browserify.js
rollup ./es6-1000/index.js > dist/rollup.js