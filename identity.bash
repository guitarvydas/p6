#!/bin/bash
set -e
set -o pipefail
npm install
node pbp/das/das2json.mjs identity-p6.drawio
rm -f out.*
python3 main.py . prolog-6-modified.scm main p6.drawio.json | node pbp/kernel/splitoutput.js
if [ -f "out.✗" ]; then
    echo '** ERRORS **'
    cat "out.✗"
else
    echo '** OK! Identity transpiled to Javascript **'
    cat prolog.js
fi
