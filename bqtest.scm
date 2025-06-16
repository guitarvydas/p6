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
