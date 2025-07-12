

(define (try db g r e n)
  (if (null? r)
      #f
      (let* ((a  (copy (car r) (list n)))
             (ne (unify (car g) (car a) e)))
        (if ne
	    (let ((appnd (append (cdr a) (cdr g))))
              (prove3 db appnd ne (+ 1 n))))
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
                    (append (cdr a) `(r! ,l) (cdr g))
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
					;(display "lookup v=") (display v) (display " e=") (display e) (newline)
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

;; ;; manually rewritten named let
;; (define (lookup_loop e id tm)
;;     (cond ((not (pair? (caar e)))
;; 	   #f)
;; 	  ((and (eq? id (name (caar e)))
;; 		(eqv? tm (time (caar e))))
;; 	   (car e))
;; 	  (else
;; 	   (lookup_loop (cdr e) id tm))))

;; (define (lookup v e)
;;     (let ((id (name v))
;;           (tm  (time v)))
;;       (lookup_loop e id tm)))
;; ;;; end rewrite

(define (value x e)
					;(display "value x=") (display x) (display " e=") (display e) (newline)
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
  ;(display "unify (xx yy e)") (display xx) (display " ") (display yy) (display " ") (display e) (newline)
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
  (let loop ((ee e))
    (cond ((pair? (cdr ee))
            (cond ((null? (time (caar ee)))
                    (display (cadaar ee))
                    (display " = ")
                    (display (resolve (caar ee) e))
                    (newline)))
            (loop (cdr ee))))))

;; ;; manually rewritten named lambda 
;; (define (has_bindings_Q_ ee)
;;   (pair? (cdr ee)))

;; (define (get_var_name_from_binding ee)
;;   (cadaar ee))

;; (define (get_binding_value_from_binding ee e)
;;   (resolve (caar ee) e))

;; (define (no_timestamp_binding_Q_ ee)
;;   (null? (time (caar ee))))

;; (define (get_rest_of_bindings ee)
;;   (cdr ee))

;; (define (print_frame_helper ee all_bindings accumulator)
;;   (cond ((has_bindings_Q_ ee)
;; 	 (let ((var_name (get_var_name_from_binding ee))
;; 	       (binding_value (get_binding_value_from_binding ee all_bindings))
;; 	       (remaining_bindings (get_rest_of_bindings ee)))
;;            (cond ((no_timestamp_binding_Q_ ee)
;; 		  (print_frame_helper remaining_bindings 
;; 				      all_bindings 
;; 				      (cons 
;; 				       (cons var_name binding_value)
;; 				       accumulator)))
;; 		 (else 
;; 		  (print_frame_helper remaining_bindings 
;; 				      all_bindings 
;; 				      accumulator)))))
;;         (else accumulator)))

;; (define (print-frame e)
;;   (let ((final_result (print_frame_helper e e '())))
;;     final_result))



;; Graph example from section 1

(define db0
  '(((edge a b))

    ((path (? A) (? B) ((? A) (? B)))
     (edge (? A) (? B)))
))








;; (display (value '(? a 1) '(((? p) ((? a 1) (? b 1))) ((? b 1) b) ((? a 1) a) (bottom))))
;; (newline)
;; (display (value 'a '(((? p) ((? a 1) (? b 1))) ((? b 1) b) ((? a 1) a) (bottom))))
;; (newline)
(define goals0 '((path a b (? P))))
;; (display goals0)
;; (newline)
;; (newline)
;; (display "*** prove3 ***")
;; (newline)
(prove3 db0 goals0 empty 1)
(newline)

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

; 6-slide PROVE
(prove5 db1 '() goals1 db1 empty 1)
