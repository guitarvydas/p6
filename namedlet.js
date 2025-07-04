// (define (lookup v e)
//   (let ((id (name v))
//         (t  (time v)))
//     (let loop ((e e))
//       (cond ((not (pair? (caar e)))
//               #f)
//             ((and (eq? id (name (caar e)))
//                   (eqv? t (time (caar e))))
//               (car e))
//             (else
//              (loop (cdr e)))))))

function lookup (v, e) {
    let id = name (v);
    let t = time (v);
    function loop (e) {
	while (e) {
	    if (! pair_Q (caar (e))) {
		RESULT = false;
		break;
	    } else if ((eq_Q (id, name (caar (e))) && eqv_Q (t, time (caar (e))))) {
		RESULT = car (e);
		break;
	    } else {
		e = cdr (e);
	    }
	}
	return RESULT;
    }
    loop (e);
}
