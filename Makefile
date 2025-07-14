all:
	./make.bash

scm:
	mit-scheme --silent --load "prolog-6-modified" --eval "(exit)"
