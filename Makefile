all:
	./make.bash

identity:
	./identity.bash

testlisp:
	cat lisp.js testlisp.js >temp.js
	node temp.js

scm:
	mit-scheme --silent --load "prolog-6-modified" --eval "(exit)"
