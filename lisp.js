class Pair {
    constructor (first, rest = null) {
        this.first = first;
        this.rest = rest;
    }
    
    toArray () {
        const result = [];
        let current = this;
        while (current !== null) {
            if (current.first instanceof Pair) {
                result.push(current.first.toArray());  // Recursive call!
            } else {
                result.push(current.first);
            }
            current = current.rest;
        }
        return result;
    }
    
    // Get length
    get length() {
        let count = 0;
        let current = this;
        while (current !== null) {
            count++;
            current = current.rest;
        }
        return count;
    }
    
    toString () {
	return tostr (this);
    }
}

function car (pair) {
    return pair ? pair.first : null;
}

function cdr (pair) {
    return pair ? pair.rest : null;
}

function cons (x, y) {
    return new Pair(x, y);
}

function list (...args) {
    let result = null;
    for (let i = args.length - 1; i >= 0; i--) { // from back to front
        result = cons(args[i], result);
    }
    return result;
}
    
// Convert Pair list to JS array (already exists as toArray method)
function listToArray(list) {
    return list ? list.toArray() : [];
}

// Additional utility functions

// Check if something is a Pair (could be improper list)
function isPair(obj) {
    return obj instanceof Pair;
}

// List operations
function append(list1, list2) {
    if (list1 === null) return list2;
    return cons(car(list1), append(cdr(list1), list2));
}

function reverse(list) {
    let result = null;
    let current = list;
    while (current !== null) {
        result = cons(car(current), result);
        current = cdr(current);
    }
    return result;
}


// Mapcar - applies function to each ELEMENT, returns list of results
function mapcar(fn, list) {
    if (list === null) return null;
    return cons(fn(car(list)), mapcar(fn, cdr(list)));
}

// Maplist - applies function to each SUBLIST (list and its successive tails)
function maplist(fn, list) {
    if (list === null) return null;
    return cons(fn(list), maplist(fn, cdr(list)));
}

// Filter function over list
function filterList(predicate, list) {
    if (list === null) return null;
    
    const head = car(list);
    const tail = filterList(predicate, cdr(list));
    
    if (predicate(head)) {
        return cons(head, tail);
    } else {
        return tail;
    }
}

function caar (list) {
    return car (car (list));
}
function cadaar (list) {
    return car (cdr (car (car (list))));
}
function cadr (list) {
    return car (cdr (list));
}
function caddr (list) {
    return car (cdr (cdr (list)));
}
function cadddr (list) {
    return car (cdr (cdr (cdr (list))));
}
function cddr (list) {
    return cdr (cdr (list));
}
function cdddr (list) {
    return cdr (cdr (cdr (list)));
}
function cddddr (list) {
    return cdr (cdr (cdr (cdr (list))));
}

function null_Q (list) {
    return list == [] || list == null;
}

function pair_Q (list) {
    return isPair (list);
}

function newline () {
//    process.stdout.write ("\n");
    console.log ();
    return "\n";
}

function display (x) {
    if (x == null) {
	process.stdout.write ("null");
//	console.log ("null");
    } else {
	let s = x.toString ().replace(/_Q/g, '?');
	process.stdout.write (s);
//	console.log (s);
    }
    return x;
}

let RESULT_STACK = [null];
function PUSH () { RESULT_STACK.push (undefined); }
function POP () { return RESULT_STACK.pop (); }
function SET (x) { RESULT_STACK.pop (); RESULT_STACK.push (x); return x;}
function MERGE () { let v = RESULT_STACK.pop (); SET (v); return v; }

// JavaScript implementation of Scheme eq? and eqv?

// eq? - Object identity comparison (same memory location)
function eq_Q(a, b) {
    // In Scheme, eq? tests if two objects are the same object in memory
    // JavaScript === is the closest equivalent
    return a === b;
}

// eqv? - Like eq? but also handles numbers and characters by value
function eqv_Q(a, b) {
    // Handle NaN case - in Scheme, (eqv? +nan.0 +nan.0) is #t
    if (Number.isNaN(a) && Number.isNaN(b)) {
        return true;
    }
    
    // Handle signed zeros - in Scheme, (eqv? +0.0 -0.0) is #f
    if (a === 0 && b === 0) {
        return Object.is(a, b);  // Distinguishes +0 from -0
    }
    
    // For everything else, use strict equality (like eq?)
    return a === b;
}

function strcat (s1, s2) {
    return `${s1}${s2}`;
}

function stringify (x) {
    return `${x}`;
}

function set__car_B (cell, v) {
    cell.first = v;
    return v;
}
