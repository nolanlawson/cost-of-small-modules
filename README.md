cost-of-small-modules
=========

A benchmark demonstrating the performance hit of different module bundlers, given different numbers of modules.

[Blog post](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/)

Changes since the blog post was published
----

- use `webpack -p` ([#6](https://github.com/nolanlawson/cost-of-small-modules/pull/6))
- use `gzip -9` ([[#7](https://github.com/nolanlawson/cost-of-small-modules/pull/7))
- add RequireJS and RequireJS+Almond ([#5](https://github.com/nolanlawson/cost-of-small-modules/pull/5))

Build
---

Check out the code, then:

    npm install

To rebuild:

    npm run build

To serve locally:

    npm run serve

To publish to `gh-pages`:

    npm run publish-site
