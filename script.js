(function () {
  'use strict'

  var results = document.querySelector('#results')
  var button = document.querySelector('#run-test')

  function runTest() {
    results.innerHTML = ''
    var promise = Promise.resolve()
    var nums = [ '10', '100', '1000' ]
    nums.forEach(num => {
      var bundlers = ['browserify', 'browserify-collapsed', 'webpack', 'rollup']
      bundlers.forEach(bundler => {
        promise = promise.then(() => {
          return new Promise(resolve => {
            window._updatePerf = function () {
              var time = performance.now() - window._lastTime
              results.innerHTML += num + ' ' + bundler + ' ' + time + ' ms\n'
              resolve()
            }
            var src = 'dist/' + bundler + '-' + num + ".min.js?nonce=" + btoa(Math.random())
            var script = document.createElement('script')
            script.src = src
            window._lastTime = performance.now()
            document.body.appendChild(script)
          })
        })
      })
    })
    return promise
  }

  button.addEventListener('click', () => {
    button.disabled = true
    runTest().then(() => {
      button.disabled = false
    })
  })

  document.body.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {

    }
  })
})()
