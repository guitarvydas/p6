edge(a,b).
edge(b,d).
edge(d,h).
edge(a,f).
edge(c,d).
edge(h,e).
edge(a,g).
edge(c,e).
edge(h,f).
path(A,B,[A,B]) :- edge(A,B).
