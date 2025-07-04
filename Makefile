all:
	./make.bash

dev:
	./dev.bash

identity:
	./identity.bash

testlisp:
	cat lisp.js testlisp.js >temp.js
	node temp.js

