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

// Examples and tests
console.log('=== Array to List Conversion ===');

// Test with various arrays
const arrays = [
    [],
    ['a'],
    ['a', 'b', 'c'],
    [1, 2, 3, 4, 5],
    ['hello', 'world', 'javascript']
];

arrays.forEach(arr => {
    console.log(`Array: [${arr.join(', ')}]`);
    const list = listify(arr);
    console.log(`List: ${list ? list.toString() : 'null'}`);
    console.log(`Back to array: [${listToArray(list).join(', ')}]`);
    console.log(`Length: ${list ? list.length : 0}`);
    console.log('---');
});

// Test nested structures
console.log('\n=== Nested Pairs ===');
const nestedList = cons('a', cons(cons('b', cons('c', null)), cons('d', null)));
console.log('Nested list:', nestedList.toString());
console.log('Nested as array:', JSON.stringify(nestedList.toArray()));

// Create complex nested structure
const innerList1 = listify(['x', 'y']);
const innerList2 = listify(['p', 'q']);
const complexList = cons('start', cons(innerList1, cons('middle', cons(innerList2, cons('end', null)))));
console.log('Complex nested:', complexList.toString());
console.log('Complex as array:', JSON.stringify(complexList.toArray()));

// Test Prolog-style nested terms
const prologTerm = cons('path', cons('a', cons('b', cons(listify(['a', 'c', 'b']), null))));
console.log('Prolog term:', prologTerm.toString());
console.log('Prolog as array:', JSON.stringify(prologTerm.toArray()));

// Test deeply nested
const deeplyNested = cons('outer', cons(cons('inner1', cons(cons('deep', null), null)), cons('inner2', null)));
console.log('Deeply nested:', deeplyNested.toString());
console.log('Deep as array:', JSON.stringify(deeplyNested.toArray()));

// Test list operations
console.log('\n=== List Operations ===');
const list1 = listify(['a', 'b', 'c']);
const list2 = listify(['d', 'e']);

console.log('List 1:', list1.toString());
console.log('List 2:', list2.toString());

console.log('car(list1):', car(list1));
console.log('cdr(list1):', cdr(list1).toString());

const appended = append(list1, list2);
console.log('Appended:', appended.toString());

const reversed = reverse(list1);
console.log('Reversed list1:', reversed.toString());

// Test structure sharing
console.log('\n=== Structure Sharing ===');
const baseList = listify(['b', 'c', 'd']);
const extendedList = cons('a', baseList);

console.log('Base list:', baseList.toString());
console.log('Extended list:', extendedList.toString());
console.log('Shares structure:', cdr(extendedList) === baseList);

// Test with higher-order functions
console.log('\n=== Higher-Order Functions ===');
const numbers = listify([1, 2, 3, 4, 5]);
console.log('Numbers:', numbers.toString());

const doubled = mapcar(x => x * 2, numbers);
console.log('Doubled:', doubled.toString());

const evens = filterList(x => x % 2 === 0, numbers);
console.log('Even numbers:', evens.toString());

// Prolog-style usage example
console.log('\n=== Prolog-style Example ===');
function buildPath(steps) {
    return listify(steps);
}

function extendPath(newStep, existingPath) {
    return cons(newStep, existingPath);
}

const originalPath = buildPath(['c', 'd', 'e']);
const extendedPath = extendPath('b', originalPath);
const fullPath = extendPath('a', extendedPath);

console.log('Original path:', originalPath.toString());
console.log('Extended path:', extendedPath.toString());
console.log('Full path:', fullPath.toString());
console.log('Structure sharing verified:', 
	    cdr(extendedPath) === originalPath && 
	    cdr(fullPath) === extendedPath);

// Convert back to arrays for final display
console.log('\n=== Final Array Conversions ===');
console.log('Original path as array:', listToArray(originalPath));
console.log('Extended path as array:', listToArray(extendedPath));
console.log('Full path as array:', listToArray(fullPath));
