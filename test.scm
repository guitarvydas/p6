; `a —> (quote a)
; `,a —> a
; `(a) —> (list (quote a))
; `(a b c) —> (list (quote a) (quote b) (quote c))
; `(a ,b c) —> (list (quote a) b (quote c))
; ,a —-> error (comma not inside backquote)

`a
`,a
`(a)
`(a b c)
`(a ,b c)
;,a
'x
'(x)
'(x y z)
(list x 'y z)
(p.q)
(r . s)
`,(p.q)
`(r . s)
(define L_l car)
