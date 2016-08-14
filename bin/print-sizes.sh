#!/usr/bin/env bash

echo "ungzipped:"

printf '||'
for i in 100 1000 5000; do
  printf "$i modules"
  printf '|'
done
echo

echo '| ---- | ---- | ---- | ---- |'

for bundler in browserify browserify-collapsed webpack rollup closure; do
  printf '|'
  printf $bundler
  printf '|'
  for i in 100 1000 5000; do
    printf "$(cat dist/$bundler-${i}.min.js | wc -c)"
    printf '|'
  done
  echo
done

echo "gzipped:"

printf '||'
for i in 100 1000 5000; do
  printf "$i modules"
  printf '|'
done
echo

echo '| ---- | ---- | ---- | ---- |'

for bundler in browserify browserify-collapsed webpack rollup closure; do
  printf '|'
  printf $bundler
  printf '|'
  for i in 100 1000 5000; do
    printf "$(gzip -c dist/$bundler-${i}.min.js | wc -c)"
    printf '|'
  done
  echo
done