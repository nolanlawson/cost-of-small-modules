#!/usr/bin/env bash

PATH=$PATH:$(pwd)/node_modules/.bin

rimraf lib dist
mkdirp lib dist

for num in 100 1000 5000; do

  mkdirp lib/cjs-${num} lib/es6-${num}

  echo "var total = 0" > lib/cjs-${num}/index.js
  echo "var total = 0" > lib/es6-${num}/index.js

  for ((i=0;i<${num};i++)); do
    echo "module.exports = ${i}" > lib/cjs-${num}/module_${i}.js
    echo "export default ${i}" > lib/es6-${num}/module_${i}.js
    echo "total += require('./module_${i}')" >> lib/cjs-${num}/index.js
    echo -e "import module_${i} from './module_${i}'\ntotal += ${i}" >> lib/es6-${num}/index.js
  done

  echo "console.log(total)" >> lib/cjs-${num}/index.js
  echo "console.log(total)" >> lib/es6-${num}/index.js

  browserify ./lib/cjs-${num} > dist/browserify-${num}.js
  browserify -p bundle-collapser/plugin ./lib/cjs-${num} > dist/browserify-collapsed-${num}.js
  webpack -p --entry ./lib/cjs-${num} --output-filename dist/webpack-${num}.js >/dev/null
  rollup --format iife ./lib/es6-${num}/index.js > dist/rollup-${num}.js
  ccjs lib/es6-${num}/* --compilation_level=ADVANCED_OPTIMIZATIONS \
    --language_in=ECMASCRIPT6_STRICT --output_wrapper="(function() {%output%})()" > dist/closure-${num}.js
  r.js -convert lib/cjs-${num} lib/amd-${num}
  r.js -o baseUrl=lib/amd-${num} paths.requireLib=../../node_modules/requirejs/require name=index \
    include=requireLib out=dist/rjs-${num}.js optimize=none logLevel=4
  r.js -o baseUrl=lib/amd-${num} paths.almond=../../node_modules/almond/almond name=index \
    include=almond out=dist/rjs-almond-${num}.js optimize=none logLevel=4

done

for file in dist/*; do
  echo $'_markLoaded();\n'"$(cat $file)" > $file
  echo $';\n_markFinished()' >> $file
done

for file in dist/*; do
  uglifyjs -mc < $file > "$(echo $file | sed 's/\.js/\.min.js/')"
done

buble script.js > script.es5.js
