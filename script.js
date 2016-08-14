(function () {
  'use strict'

  /* global performance btoa */

  // do this many iterations and then take the median
  var ITERATIONS = 15
  var NUM_MODULES = [ '100', '1000', '5000' ]
  var BUNDLERS = [ 'browserify', 'browserify-collapsed', 'webpack', 'rollup', 'closure' ]

  var results = document.querySelector('#results')
  var button = document.querySelector('#run-test')

  window._markLoaded = function () {
    window._loadedTS = performance.now()
  }

  function round (num) {
    return Math.round(num * 100) / 100
  }

  function getMedianTime (bundler, numModules) {
    var promise = Promise.resolve()

    var runs = []

    function iter () {
      promise = promise.then(() => {
        return new Promise(resolve => {
          window._markFinished = function () {
            var finish = performance.now()
            resolve({
              loadTime: window._loadedTS - window._startTS,
              runTime: finish - window._loadedTS,
              totalTime: finish - window._startTS
            })
          }
          var src = 'dist/' + bundler + '-' + numModules + '.min.js?nonce=' + btoa(Math.random())
          var script = document.createElement('script')
          script.src = src
          window._startTS = performance.now()
          document.body.appendChild(script)
        }).then(res => runs.push(res))
      })
    }

    for (var i = 0; i < ITERATIONS; i++) {
      iter()
    }
    return promise.then(() => {
      var median = runs.sort((a, b) => a.totalTime - b.totalTime)[Math.floor(runs.length / 2)]
      results.innerHTML += [
        bundler,
        round(median.loadTime),
        round(median.runTime),
        round(median.totalTime)
      ].join(',') + '\n'
    })
  }

  function runTest () {
    results.innerHTML = ''
    var promise = Promise.resolve()
    NUM_MODULES.forEach(numModules => {
      BUNDLERS.forEach((bundler, i) => {
        promise = promise.then(() => {
          if (i === 0) {
            results.innerHTML += numModules + ' modules\n'
            results.innerHTML += 'Bundler,Load time (ms),Run time (ms),Total time (ms)\n'
          }
          return getMedianTime(bundler, numModules)
        })
      })
    })
    return promise
  }

  button.addEventListener('click', () => {
    button.disabled = true
    runTest().then(() => {
      button.disabled = false
    }).catch(console.log.bind(console))
  })

  document.body.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {

    }
  })
})()
