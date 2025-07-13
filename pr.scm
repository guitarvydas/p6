(define (tostr x)
  (cond ((null? x) "")
	((pair? x) (strcat (stringify (car x)) (tostr (cdr x))))
	(else (stringify x))))
