(define (prove3 g e n)
  (cond ((null? g)
          (print-frame e))
        (else
          (try g db e n))))
