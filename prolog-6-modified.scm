
(define (try db g r e n)
  (if (null? r)
      #f
      (let* ((a  (copy (car r) (list n)))
             (ne (unify (car g) (car a) e)))
        (if ne
            (prove3 db (append (cdr a) (cdr g)) ne (+ 1 n)))
        (try db g (cdr r) e n))))

(define (prove3 db g e n)
  (cond ((null? g)
          (print-frame e))
        (else
          (try db g db e n))))


(define link list)
(define L_l car)
(define L_g cadr)
(define L_r caddr)
(define L_e cadddr)
(define (L_n x) (car (cddddr x)))


(define (back5 db l g r e n)
  (if (and (pair? g)
           (pair? r))
      (prove5 db l g (cdr r) e n)
      (prove5 db
	      (L_l l)
              (L_g l)
              (cdr (L_r l))
              (L_e l)
              (L_n l))))


(define (prove5 db l g r e n)
  (cond
    ((null? g)
      (print-frame e)
      (back5 db l g r e n))
    ((null? r)
      (if (null? l)
          #t
          (back5 db l g r e n)))
    (else
      (let* ((a  (copy (car r) n))
             (e* (unify (car a) (car g) e)))
        (if e*
            (prove5 db
		    (link l g r e n)
                    (append (cdr a) (cdr g))
                    db
                    e*
                    (+ 1 n))
            (back5 db l g r e n))))))


(define (L_c x) (cadr (cddddr x)))


(define (clear_r x)
  (set-car! (cddr x) '(())))


(define (back6 db l g r e n c)
  (cond
    ((and (pair? g)
          (pair? r))
      (prove6 db l g (cdr r) e n c))
    ((pair? l)
     (prove6 db
	     (L_l l)
             (L_g l)
             (cdr (L_r l))
             (L_e l)
             (L_n l)
             (L_c l)))))


(define (prove6 db l g r e n c)
  (cond
    ((null? g)
      (print-frame e)
      (back6 db l g r e n c))
    ((eq? '! (car g))
      (clear_r c)
      (prove6 db c (cdr g) r e n c))
    ((eq? 'r! (car g))
      (prove6 db l (cddr g) r e n (cadr g)))
    ((null? r)
      (if (null? l)
          #t
          (back6 db l g r e n c)))
    (else
      (let* ((a  (copy (car r) n))
             (e* (unify (car a) (car g) e)))
        (if e*
            (prove6 db
		    (link l g r e n c)
                    (append (cdr a) (append `(r! ,l) (cdr g))) ;; mod
                    db
                    e*
                    (+ 1 n)
                    l)
            (back6 db l g r e n c))))))


(define empty '((bottom)))

(define var '?)
(define name cadr)
(define time cddr)

(define (var? x)
  (and (pair? x)
       (eq? var (car x))))

(define (lookup v e)
  (let ((id (name v))
        (t  (time v)))
    (let loop ((e e))
      (cond ((not (pair? (caar e)))
              #f)
            ((and (eq? id (name (caar e)))
                  (eqv? t (time (caar e))))
              (car e))
            (else
              (loop (cdr e)))))))

(define (value x e)
  (if (var? x)
      (let ((v (lookup x e)))
        (if v
            (value (cadr v) e)
            x))
      x))

(define (copy x n)
  (cond
    ((not (pair? x)) x)
    ((var? x) (append x n))
    (else
      (cons (copy (car x) n)
            (copy (cdr x) n)))))

(define (bind x y e)
  (cons (list x y) e))

(define (unify xx yy e)
  (let ((x (value xx e))
        (y (value yy e)))
    (cond
      ((eq? x y) e)
      ((var? x) (bind x y e))
      ((var? y) (bind y x e))
      ((or (not (pair? x))
           (not (pair? y))) #f)
      (else
        (let ((e* (unify (car x) (car y) e)))
          (and e* (unify (cdr x) (cdr y) e*)))))))


(define (resolve x e)
  (cond ((not (pair? x)) x)
        ((var? x)
          (let ((v (value x e)))
            (if (var? v)
                v
                (resolve v e))))
        (else
          (cons
            (resolve (car x) e)
            (resolve (cdr x) e)))))

(define (print-frame e)
  (newline)
  (let loop ((ee e))
    (cond ((pair? (cdr ee))
            (cond ((null? (time (caar ee)))
                    (display (cadaar ee))
                    (display " = ")
                    (display (resolve (caar ee) e))
                    (newline)))
            (loop (cdr ee))))))


;; manually added
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


;; Graph example from section 1

(define db1
  '(((edge a b))
    ((edge a f))
    ((edge a g))
    ((edge b c))
    ((edge b d))
    ((edge c d))
    ((edge c e))
    ((edge g h))
    ((edge d h))
    ((edge h e))
    ((edge h f))

    ((path (? A) (? B) ((? A) (? B)))
     (edge (? A) (? B)))

    ((path (? A) (? B) ((? A) . (? CB)))
     (edge (? A) (? C))
     (path (? C) (? B) (? CB)))))

(define goals1 '((path a f (? P))))
(prove3 db1 goals1 empty 1)

; recursive PROVE
(prove3 db1 goals1 empty 1)

; 6-slide PROVE
(prove5 db1 '() goals1 db1 empty 1)

;; Negation as failure

(define db2
  '(((some foo))
    ((some bar))
    ((some baz))

    ((eq (? X) (? X)))

    ((neq (? X) (? Y))
     (eq (? X) (? Y)) ! fail)

    ((neq (? X) (? Y)))))

(define goals2 '((some (? X))
                (some (? Y))
                (neq (? X) (? Y))))

; 9-slide PROVE
(prove6 db2 '() goals2 db2 empty 1 '())

