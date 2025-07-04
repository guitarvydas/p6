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
    
    // toString for easier debugging - handles nested Pairs recursively
    toString() {
        const elements = [];
        let current = this;
        
        while (current !== null) {
            if (current.first instanceof Pair) {
                elements.push(current.first.toString());
            } else {
                elements.push(current.first);
            }
            current = current.rest;
        }
        
        return `(${elements.join(' ')})`;
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

function listify(arg) {
    // 1. If not an array, return as is
    if (!Array.isArray(arg)) {
        return arg;
    }
    
    // 3. If empty array, return null
    if (arg.length === 0) {
        return null;
    }
    
    // 2. If array, return list of listified elements
    let result = null;
    for (let i = arg.length - 1; i >= 0; i--) {
        result = cons(listify(arg[i]), result);  // Recursive call!
    }
    
    return result;
}

function list (...args) {
    return listify (args);
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

function null_Q (list) {
    return list == [] || list == null;
}

function pair_Q (list) {
    return isPair (list);
}

function eq_Q (x, y) {
    return x === y;
}
function eqv_Q (x, y) {
    return Object.is (x, y);
}
