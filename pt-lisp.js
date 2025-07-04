class Pair {
    constructor (first, rest = null) {
	this.first = first;
	this.rest = rest;
    }

    toArray () {
	const result = [];
	let current = this;
	while (current !== null) {
	    result.push(current.first);
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
    
    arrayToList(arr) {
	if (arr.length === 0) return null;
	
	let result = null;
	for (let i = arr.length - 1; i >= 0; i--) {
            result = cons(arr[i], result);
	}
	return result;
    }
}

function car (pair) {
    return pair ? pair.first : null;
}

function cdr (pair) {
    return pair ? pair.rest : null;
}

function cons (x, y) {
    return pair = new Pair (x, y);
}
