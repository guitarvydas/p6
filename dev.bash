#!/bin/bash
set -e
set -o pipefail
npm install
node pbp/das/das2json.mjs p6.drawio
rm -f out.*
python3 main.py . test.scm main p6.drawio.json | node pbp/kernel/decodeoutput.mjs
cat out.md
mv out.js prolog.js

SIZE="$(wc -c < out.md)"
if [ "$SIZE" -gt 2 ]; then
    echo '** Messages **'
    cat out.md
else
    # echo '** input ***'
    # cat test.scm
    # echo '** transpiled to Javascript **'
    cat prolog.js
fi
