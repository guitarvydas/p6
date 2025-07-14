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

// Additional helper for equal? (deep structural equality)
function equal_Q(a, b) {
    // Handle primitives first
    if (eqv_Q(a, b)) {
        return true;
    }
    
    // Handle arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!equal_Q(a[i], b[i])) return false;
        }
        return true;
    }
    
    // Handle objects (simple case)
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        
        if (keysA.length !== keysB.length) return false;
        
        for (let key of keysA) {
            if (!keysB.includes(key) || !equal_Q(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }
    
    return false;
}

console.log('=== TESTING eq_Q (Object Identity) ===');

// Numbers
console.log('eq_Q(42, 42):', eq_Q(42, 42));                    // true
console.log('eq_Q(3.14, 3.14):', eq_Q(3.14, 3.14));           // true

// Special number cases
console.log('eq_Q(NaN, NaN):', eq_Q(NaN, NaN));                // false (JS behavior)
console.log('eq_Q(+0, -0):', eq_Q(+0, -0));                    // true (JS treats as same)

// Strings
console.log('eq_Q("hello", "hello"):', eq_Q("hello", "hello")); // true (string interning)
const str1 = "test";
const str2 = "test";
const str3 = new String("test");
console.log('eq_Q(str1, str2):', eq_Q(str1, str2));            // true
console.log('eq_Q(str1, new String("test")):', eq_Q(str1, str3)); // false

// Objects - identity only
const obj1 = { x: 1 };
const obj2 = { x: 1 };
const obj3 = obj1;
console.log('eq_Q({x:1}, {x:1}):', eq_Q(obj1, obj2));          // false (different objects)
console.log('eq_Q(obj1, obj3):', eq_Q(obj1, obj3));            // true (same reference)

// Arrays
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
const arr3 = arr1;
console.log('eq_Q([1,2,3], [1,2,3]):', eq_Q(arr1, arr2));      // false
console.log('eq_Q(arr1, arr3):', eq_Q(arr1, arr3));            // true

console.log('\n=== TESTING eqv_Q (Value Equality for Numbers) ===');

// Numbers - same as eq? for most cases
console.log('eqv_Q(42, 42):', eqv_Q(42, 42));                  // true
console.log('eqv_Q(3.14, 3.14):', eqv_Q(3.14, 3.14));         // true

// Special cases where eqv? differs from eq?
console.log('eqv_Q(NaN, NaN):', eqv_Q(NaN, NaN));              // true (Scheme behavior)
console.log('eqv_Q(+0, -0):', eqv_Q(+0, -0));                  // false (Scheme behavior)

// Other types - same as eq?
console.log('eqv_Q("hello", "hello"):', eqv_Q("hello", "hello")); // true
console.log('eqv_Q(obj1, obj2):', eqv_Q(obj1, obj2));          // false
console.log('eqv_Q(obj1, obj3):', eqv_Q(obj1, obj3));          // true

console.log('\n=== TESTING equal_Q (Structural Equality) ===');

// Primitives - same as eqv?
console.log('equal_Q(42, 42):', equal_Q(42, 42));              // true
console.log('equal_Q("hello", "hello"):', equal_Q("hello", "hello")); // true

// Objects with same structure
const objA = { x: 1, y: 2 };
const objB = { x: 1, y: 2 };
const objC = { x: 1, y: 3 };
console.log('equal_Q({x:1,y:2}, {x:1,y:2}):', equal_Q(objA, objB)); // true
console.log('equal_Q({x:1,y:2}, {x:1,y:3}):', equal_Q(objA, objC)); // false

// Arrays with same elements
const arrA = [1, 2, 3];
const arrB = [1, 2, 3];
const arrC = [1, 2, 4];
console.log('equal_Q([1,2,3], [1,2,3]):', equal_Q(arrA, arrB)); // true
console.log('equal_Q([1,2,3], [1,2,4]):', equal_Q(arrA, arrC)); // false

// Nested structures
const nestedA = { arr: [1, 2], obj: { x: 1 } };
const nestedB = { arr: [1, 2], obj: { x: 1 } };
const nestedC = { arr: [1, 2], obj: { x: 2 } };
console.log('equal_Q(nested, nested):', equal_Q(nestedA, nestedB)); // true
console.log('equal_Q(nested, different):', equal_Q(nestedA, nestedC)); // false

console.log('\n=== COMPARISON WITH JAVASCRIPT OPERATORS ===');

const testCases = [
    [42, 42],
    [NaN, NaN],
    [+0, -0],
    ["hello", "hello"],
    [obj1, obj2],
    [obj1, obj3],
    [true, true],
    [null, null],
    [undefined, undefined]
];

console.log('Value A\t\tValue B\t\t===\teq_Q\teqv_Q\tequal_Q');
console.log(''.padEnd(60, '-'));

testCases.forEach(([a, b]) => {
    const aStr = String(a).padEnd(12);
    const bStr = String(b).padEnd(12);
    const strict = (a === b).toString().padEnd(5);
    const eq = eq_Q(a, b).toString().padEnd(5);
    const eqv = eqv_Q(a, b).toString().padEnd(5);
    const equal = equal_Q(a, b).toString().padEnd(5);
    
    console.log(`${aStr}\t${bStr}\t${strict}\t${eq}\t${eqv}\t${equal}`);
});

console.log('\n=== LISP-STYLE USAGE EXAMPLES ===');

// Simulate Lisp pair comparisons
class Pair {
    constructor(car, cdr) {
        this.car = car;
        this.cdr = cdr;
    }
    
    toString() {
        return `(${this.car} . ${this.cdr})`;
    }
}

const pair1 = new Pair('a', 'b');
const pair2 = new Pair('a', 'b');
const pair3 = pair1;

console.log('--- Pair Comparisons ---');
console.log('pair1:', pair1.toString());
console.log('pair2:', pair2.toString());
console.log('pair3 = pair1');

console.log('eq_Q(pair1, pair2):', eq_Q(pair1, pair2));        // false - different objects
console.log('eq_Q(pair1, pair3):', eq_Q(pair1, pair3));        // true - same reference
console.log('eqv_Q(pair1, pair2):', eqv_Q(pair1, pair2));      // false - different objects
console.log('eqv_Q(pair1, pair3):', eqv_Q(pair1, pair3));      // true - same reference

// Structure sharing example
const sharedCdr = new Pair('c', null);
const pair4 = new Pair('a', sharedCdr);
const pair5 = new Pair('b', sharedCdr);

console.log('\n--- Structure Sharing ---');
console.log('pair4:', pair4.toString());
console.log('pair5:', pair5.toString());
console.log('eq_Q(pair4.cdr, pair5.cdr):', eq_Q(pair4.cdr, pair5.cdr)); // true - shared structure
console.log('eq_Q(pair4, pair5):', eq_Q(pair4, pair5));                 // false - different pairs

console.log('\n=== SUMMARY ===');
console.log('eq_Q(a, b):    JavaScript a === b (object identity)');
console.log('eqv_Q(a, b):   Like eq_Q but handles NaN and signed zeros');
console.log('equal_Q(a, b): Deep structural comparison (like Scheme equal?)');
console.log('');
console.log('Use eq_Q for:    Identity checks, performance-critical code');
console.log('Use eqv_Q for:   Number comparisons, Scheme-like behavior');
console.log('Use equal_Q for: Content comparison, deep equality');
