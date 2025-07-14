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
