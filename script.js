/**
 * Adds two given numbers and returns the resulting sum.
 * @example
 * // returns 5
 * add(2, 3);
 * @param {number} a - a number to be added
 * @param {number} b - a number to be added
 * @returns {number} The sum of a and b
 */
function add(a, b){
    return a + b;
}

/**
 * Subtracts two given numbers and returns the difference.
 * @example
 * // returns 2
 * subtract(5, 3);
 * @param {number} a - a number to be subtracted from
 * @param {number} b - a number to subtract from a
 * @returns {number} The difference of a and b
 */
 function subtract(a, b){
    return a - b;
}

/**
 * Multiplies two given numbers and returns the product.
 * @example
 * // returns 6
 * multiply(2, 3);
 * @param {number} a - a number to be multiplied
 * @param {number} b - a number to be multiplied
 * @returns {number} The product of a and b
 */
 function multiply(a, b){
    return a * b;
}

/**
 * Divides two given numbers and returns the quotient.
 * @example
 * // returns 3
 * divide(6, 2);
 * @param {number} a - a dividend number
 * @param {number} b - a divisor number
 * @returns {number} The quotient of a and b
 */
 function divide(a, b){
    return a / b;
}

/**
 * Takes an operator and 2 numbers, and calls the appropriate function with
 * those 2 numbers, returning the result.
 * @example
 * // returns 6
 * operate("+", 4, 2);
 * @param {string} operator - the operator symbol of the function
 * @param {number} a - a number
 * @param {number} b - a number
 * @returns {number} The result of the operation
 */
function operate(operator, a, b){
    // Ensure a and b are numbers
    a = Number(a);
    b = Number(b);
    if(isNaN(a) || isNaN(b)){
        return null;
    }

    switch(operator){
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
            break;
        case "×": // Fallthrough
        case "x":
        case "X":
        case "*":
            return multiply(a, b);
            break;
        case "÷": // Fallthrough
        case "/":
            // ensure we are not dividing by 0
            if (b === 0) {
                return null;
            }
            return divide(a, b);
            break;
        default:
            return null;
    }
}