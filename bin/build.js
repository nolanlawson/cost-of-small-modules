var rimraf = require('rimraf')
var mkdirp = require("mkdirp")
var fs = require('fs')
var times = require('lodash.times')
var browserify = require('browserify')
var rollup = require('rollup').rollup

rimraf.sync('./cjs-1000')
rimraf.sync('./es6-1000')
rimraf.sync('./dist')

mkdirp.sync('./cjs-1000')
mkdirp.sync('./es6-1000')
mkdirp.sync('./dist')

for (var i = 0; i < 1000; i++) {
  fs.writeFileSync(`./cjs-1000/module_${i}.js`, `module.exports = ${i}`, 'utf8')
  fs.writeFileSync(`./es6-1000/module_${i}.js`, `export default ${i}`, 'utf8')
}

fs.writeFileSync('./cjs-1000/index.js',
  [
    'var total = 0',
    times(1000, i => `total += require('./module_${i}')`).join('\n'),
    'console.log(total)'
  ].join('\n'),
  'utf8')
fs.writeFileSync('./es6-1000/index.js',
  [
    'var total = 0\n',
    times(1000, i => `import module_${i} from './module_${i}'`).join('\n'),
    times(1000, i => `total += module_${i}`).join('\n'),
    'console.log(total)'
  ].join('\n'),
  'utf8')

browserify('./cjs-1000')
  .bundle()
  .pipe(fs.createWriteStream('./dist/browserify.js'))

rollup({
  entry: './es6-1000/index.js'
}).then(bundle => {
  return bundle.write({
    format: 'iife',
    dest: 'dist/rollup.js'
  })
}).then(() => {

})