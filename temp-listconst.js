(define empty '((bottom)))
const empty = [["bottom"]];

(define var '?)
const var = "?";

(define goals '((some (? X))
                (some (? Y))
                (neq (? X) (? Y))))

(define goals '⟪⟪‹some› ⟪‹?› ‹X›⟫⟫
                ⟪‹some› ⟪‹?› ‹Y›⟫⟫
                ⟪‹neq› ⟪‹›? ‹X›⟫ ⟪‹?› ‹Y›⟫⟫⟫)

const goals = ⟪
  ⟪‹some›, ⟪‹?›, ‹X›⟫⟫,
  ⟪‹some›, ⟪‹?›, ‹Y›⟫⟫,
  ⟪‹neq›, ⟪‹?›, ‹X›⟫, ⟪‹?›, ‹Y›⟫⟫
⟫;
‹
› 
⟪
⟫
⦓
{
}
