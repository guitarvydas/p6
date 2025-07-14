#!/bin/bash
set -e
set -o pipefail
# npm install
node pbp/das/das2json.mjs p6.drawio
rm -f out.*
python3 main.py . test.scm main p6.drawio.json | node pbp/kernel/splitoutput.js
if [ -f "out.✗" ]; then
    cat "out.✗"
else
    cat lisp.js out.js >prolog.js
    node prolog.js
fi
