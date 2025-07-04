# Prolog6.scm to Javascript

# usage
To transpile prolog-6.scm to prolog.js:

`$ make`

## dev
To transpile test.scm to prolog.js:
`$ make dev`
## testlisp
To test `lisp.js` (concatenates `lisp.js` and `testlisp.js` into `temp.js`, then runs `temp.js`
`$ make testlisp`
## identity transpilation
Early sanity test: just run `test.scm` through transpiler and expect the output to be the same as the input (reveals silly errors in workflow)
`$ make identity`
(N.B. this was used early in the development workflow and may fail due to incremental changes to the main workflow)

