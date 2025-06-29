(define (try g r e n)
    (if (null? r)
	‹false›
	(let* ((a (copy (car r) (list n)))
	       (ne (unify (car g) (car a) e)))
	  (if ne
	      (prove3 (append (cdr a) (cdr g)) ne (+ ‹1› n)))
	  (try g (cdr r) e n))))

defproc try
  defparam g
  defparam r
  defparam e
  defparam n
  loadParam r
  call null?
  test
  brfalse L1
    loadBooleanConst false
    br L2
  L1:
;	(let* ((a (copy (car r) (list n)))
    deflocal a
    deflocal ne
    ;; car r
    loadParam r
    call car
    ;; list n
    loadParam n
    call list
    ;; a = copy tos, tos-1
    call copy
    assignLocal, a
;	       (ne (unify (car g) (car a) e)))
    ;; car g
    loadParam g
    call car
    ;; car a
    loadParam a
    call car
    ;; e
    loadParam e
    ;; unify
    call unify
    ;; assign to local ne
    assignLocal ne
;	  (if ne
    loadLocal ne
    test
    brfalse L3
;	      (prove3 (append (cdr a) (cdr g)) ne (+ ‹1› n)))
    loadLocal a
    loadParam g
    call append
    loadLocal ne
    loadIntConstant 1
    loadParam n
    call plus
    call prove3
L3:   
;	  (try g (cdr r) e n))))
    loadParam g
    loadParam r
    call cdr
    loadParam e
    loadParam n
    call try    
L2:
   done


;(define (try g r e n)
;    (if (null? r)
;	‹false›
;	(let* ((a (copy (car r) (list n)))
;	       (ne (unify (car g) (car a) e)))
;	  (if ne
;	      (prove3 (append (cdr a) (cdr g)) ne (+ ‹1› n)))
;	  (try g (cdr r) e n))))
;
// javascript
function try (g, r, e, n) {
  let RESULT = undefined;
  if (null?(r)) {
    RESULT = False;
    {
      let a = copy (car (r), list (n));
      le ne = unify (car (g), car (a), e);
      if (ne) {
        prove3 (append (cdr (a), cdr (g)), ne, n + 1);
      }
      RESULT = try (g, cdr (r), e, n);
    }
  }
  return RESULT;
}
