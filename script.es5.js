(function () {
  'use strict'

  /* global performance btoa */

  // do this many iterations and then take the median
  var ITERATIONS = 15
  var NUM_MODULES = [ '100', '1000', '5000' ]
  var BUNDLERS = [ 'browserify', 'browserify-collapsed', 'webpack', 'rollup', 'closure', 'rjs', 'rjs-almond' ]

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
      promise = promise.then(function () {
        return new Promise(function (resolve) {
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
        }).then(function (res) { return runs.push(res); })
      })
    }

    for (var i = 0; i < ITERATIONS; i++) {
      iter()
    }
    return promise.then(function () {
      var median = runs.sort(function (a, b) { return a.totalTime - b.totalTime; })[Math.floor(runs.length / 2)]
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
    NUM_MODULES.forEach(function (numModules) {
      BUNDLERS.forEach(function (bundler, i) {
        promise = promise.then(function () {
          if (i === 0) {
            results.innerHTML += numModules + ' modules,,,\n'
            results.innerHTML += 'Bundler,Load time (ms),Run time (ms),Total time (ms)\n'
          }
          return getMedianTime(bundler, numModules)
        })
      })
    })
    return promise
  }

  button.addEventListener('click', function () {
    button.disabled = true
    runTest().then(function () {
      button.disabled = false
      results.innerHTML += 'Done!\n'
    }).catch(console.log.bind(console))
  })

  document.body.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {

    }
  })
})()

