#  Scheme to Javascript (Prolog engine for JS)

# usage
To transpile prolog-6-modified.scm to prolog.js:

`$ make`

The output should be the same as running the code with `mit-scheme`

`$ make scm`

## scheme
To see the modified Scheme code run:
`$ make scm` 

# Notes
The original code is in `prolog-6.scm`. This Scheme code was written by [Nils Holm](https://www.t3x.org/prolog6/).

Small modifications were made to the original code and written to `prolog-6-modified.scm`. For example, the original code uses `db` as a global variable and overwrites it several times.  The modified version passes `db1` and `db2` in as arguments to `prove3`, `prove5` and `prove6`. Likewise for the accompanying versions of `back*` and `try*`. The definition of `unify` was modified to not shadow parameters `x` and `y`. New functions `tostr` and `tailstr` were manually added to support a recursive version of `.toString()` in the `Pair` class in the JS code.

Generalized Scheme to JS is probably much harder, but, focussing on a single src program makes it easier and produces a useful result (Prolog engine in JS).

This is like the meme of using snippets of REGEX in your code (Javascript, Python, etc.), but more extreme.

This transpiler is a DEVELOPER tool. It shows that one can write code in Scheme, then transpile it to a production language.

In fact, compilers are just transpilers coupled with type-checking linters. Compilers transpile high-level code into assembler (which is then converted to machine code). There is only /one/ programming language - machine code. All popular programming languages produce machine code and provide DEVELOPERs with linting tools to make their workflows easier/better/less-buggy. Some popular programming languages construct little engines (essentially VMs) using assembler, then these programming languages transpile HLL code into scripts for the engines. Prolog is like that. Lisp 1.5 is like that. In fact, all function-based languages (C, Haskell, etc.) are like that - they transpile scripts targetted at FP machines. CPUs have become single-minded FP machines that have had baubles added to them, like virtual memory, caches, preemption, etc. To use FP machines, programmers generally need to use lots of extra bloatware called "operating systems".

Here, the goal is not to figure out how to create a generalized Scheme to Javascript transpiler, but, to demonstrate a simple programming technique wherein one focuses on a specific problem to achieve a specific result, e.g. to create a Prolog engine for Javascript. It turns out that the technique is nearly trivial - don't write code, instead write code that writes code.

For this purpose, PEG is much better than REGEX. PEG can be used to write pattern matchers for "structured" text (nested text), like most popular programming languages inspired by C syntax or recursive/nested syntax (i.e. most PLs except indentation based Python). REGEX, though, is meant to pattern match LINEs of text, not nested/structured text. OhmJS - a more advanced parsing technology based on PEG - includes the ability to parse indentation-based languages, but, I haven't explored that feature.

Transpilation consists of 2 steps:
1. pattern match -> produce an internal data structure that represents that parts of the match (this data structure is often built as an AST)
2. walk the internal data structure and spit out new code based on what was found.

To do step 1. OhmJS is the best tool that I know of.
To do step 2. OhmJS works, but is overkill. I discovered that simply creating STRINGs is an incredibly powerful technique. In fact, programming language source code is usually just a big, long string. To simplify this rewriting step, I created a small DSL that deals only with string construction and string interpolation (RWR). It turns out that making the rewriting DSL be very concise - very few LOC needed to express large transpilations - encourages thinking about new kinds of problems and solutions (like transpiling working Scheme code to Javascript, like combining languages (SWIPL (Prolog) plus Javascript (node) plus bash), etc.)

# How This Works
This version is done as a pipeline of 6 steps. This is just an example, someone might rewrite this in another manner.

Use drawio to view the source code `p6.drawio`.

1. Read the Scheme code file
2. Transpile all backquote syntax into legal, but, less-readable, Scheme syntax that doesn't use backquotes.
3. Transpile all single-quote shortcuts (`'`) into legal, but, less-readable, Scheme syntax that doesn't use shortcuts.
4. Tranpsile all constant lists into an intermediate representation that makes downstream parsing-and-transpiling easier (constant lists are transpiled to use Unicode brackets `⎨` and `⎬` to differentiate them from normal Lisp lists that use parentheses)
5. Transpile the Scheme-ish intermediate code into dumb Javascript. This is somewhat more difficult than it seems, because Scheme is an expression language, whereas JS uses statements and expressions. We have to emit code that preserves the Scheme semantis even though it is rewritten as Javascript. We bracket all JS statements with operations on a stack of values (using PUSH(), POP(), MERGE(), SET()). We don't need to worry about efficiency at this point, just semantic correctness of the resulting code. The emitted code is filled with redundant `SET (...)` function calls. We leave that dumb code alone and will prune the most egregious cases later in the pipeline.
6. Peephole the the JS code. The code emitted by step 5 works, but contains redundant `SET (...)` calls. It is simple to recognize 95% (not actually measured, this number was just pulled out of thin air) using OhmJS. Once recognized, it is simple to write RWR rules to transpile this code into less-redundant code. In this case, only one major pattern is recognized and rewritten. This doesn't catch all of the edge cases, but, is "good enough". The major pattern is that of finding `SET (...)` calls within calls to other functions (includ `SET` itself). The rewrite consists of simple removing `SET` and `(` and `)` and leaving only the parameters to the `SET` call. The rewrite rule that says this is `InnerSet [_SET lp parameter rp] = ‛«parameter»’`. The rest of the rules just hang off of the OhmJS parse and emit the same thing as they are given. Note that the pattern match is recursive, function calls and `SET` calls look for `SET` calls within their parameter lists and rewrite those, too. This is easy to express using OhmJS and RWR notations (aka SCNs, aka DSLs).

The required tools are in the pbp/ directory.

`Das2json` converts the DPL (diagrammatic programming language) from `p6.drawio` into `p6.drawio.json`. This is read in by the kernel (in this version, we use the Python kernel, which can be found in pbp/kernel) and executed. The main building block of steps 2-6 is pbp/t2t - the text-to-text transpiler tool that uses OhmJS and RWR.

The grammars for each step 2-6 are in the corresponding `.ohm` files and the RWR rewrite specs are in the corresponding `.rwr` files.

# Future
- Python version?
