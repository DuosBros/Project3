#!/bin/bash
set -e
set -u

for tex in $(find ./ -type f -iname "*tex" | grep -v !); do
  vlna $tex
done
