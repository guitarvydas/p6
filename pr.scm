(define (stringify x)
  (call-with-output-string
   (lambda (port)
     (display x port))))

(define (strcat s1 s2)
  (string-append s1 s2))

(define (deb s)
  (display s)
  (newline))

(define (tostr x)
  (cond ((null? x) "")
	((pair? x)
	 (cond ((null? (cdr x))
		(strcat "("
			(strcat (stringify (car x))
				")")))
	       ((pair? (cdr x))
		(strcat "("
			(strcat (stringify (car x))
				(strcat " "
					(strcat (tailstr (cdr x))
						")" )))))
	       (else
		(strcat "(" 
			(strcat (tostr (car x))
				(strcat " . "
					(strcat (tostr (cdr x))
						")")))))))
	(else  (stringify x))))

(define (tailstr x)
  (cond ((null? x) "")
	((pair? x)
	 (cond ((null? (cdr x))
		(stringify (car x)))
	       ((pair? (cdr x))
		(strcat (stringify (car x))
			(strcat " "
				(tailstr (cdr x)))))
	       (else
		(strcat (tostr (car x))
			(strcat " . "
				(tostr (cdr x)))))))
	(else  (stringify x))))

(display (tostr 'a))
(newline)
(display (tostr '(b)))
(newline)
(display (tostr '(d e f)))
(newline)
(display (tostr '(g . h)))
(newline)
(display (tostr '(i j k . l)))
(newline)

