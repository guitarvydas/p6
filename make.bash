#!/bin/bash
set -e
set -o pipefail
npm install
node pbp/das/das2json.mjs p6.drawio
rm -f out.*
python3 main.py . ex1.math main p6.drawio.json | node pbp/kernel/decodeoutput.mjs
cat out.md
mv out.js ex1.js

SIZE="$(wc -c < out.md)"
if [ "$SIZE" -gt 2 ]; then
    echo '** Messages **'
    cat out.md
else
    echo '** code for arithmetic expression written in a little DSL **'
    cat ex1.math
    echo '** transpiled to Javascript **'
    cat ex1.js
fi
