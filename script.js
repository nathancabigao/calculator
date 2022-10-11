const btnNumbers = document.querySelectorAll("button.num");
const btnOperators = document.querySelectorAll("button.operator");
const btnDelete = document.querySelector("button.delete");
const btnClear = document.querySelector("button.clear");
const btnEquals = document.querySelector("button.equals");
const display = document.querySelector("#display");
let currentOperator = '';
let valueA = 0, valueB = 0;
let occupiedA = false, occupiedB = false;
let overwriteDisplay = false;

addBtnListeners();

/**
 * Adds button listeners for all calculator buttons.
 */
function addBtnListeners(){
    // numbers: append number to display
    btnNumbers.forEach((btnNumber) => {
        btnNumber.addEventListener('click', insertNumber);
    });

    // clear: empty display text
    btnClear.addEventListener('click', clear);

    // delete: trim the display text by 1
    btnDelete.addEventListener('click', deleteDisplayChar);

    // operators: store operation and equate when necessary
    btnOperators.forEach((btnOperator) => {
        btnOperator.addEventListener('click', operationPress);
    });

     // equals: call operate and display results, while allowing further
     // calculations on result.
    btnEquals.addEventListener('click', () => {
        equate();
        allowChain();
    });
}

/**
 * Event: Allows for chaining calculations after equating an operation.
 */
function allowChain(){
    // Allow for chaining calculations (ex. = 11 and pressing + after)
    if(isNaN(Number(display.textContent))){
        valueA = 0; //so we don't store NaN
    }
    else{
        valueA = Number(display.textContent);
    }
    valueB = 0;
    occupiedA = false;
    occupiedB = false;
}

/**
 * Event: Insert numbers onto the display.
 * @param {Object} e - The button object of the number to insert
 */
function insertNumber(e){
    // block multiple decimals
    if(e.currentTarget.textContent == "." && display.textContent.includes(".")){
        return;
    }
    // block input after a certain length
    if(display.textContent.length >= 18){
        return;
    }
    // if current value is "0", overwrite it unless decimal
    if(display.textContent == "0" && e.currentTarget.textContent != "."){ 
        display.textContent = ""; 
    }
    // if we can overwrite the result 
    // ex. if we did 6+9, 15 will be displayed but we can overwrite by
    // pressing another button
    if(overwriteDisplay){
        display.textContent = e.currentTarget.textContent;
        overwriteDisplay = false;
    }
    else{
        display.textContent += e.currentTarget.textContent;
    }
}

/**
 * Event: Calls an operation or stores one to be called.
 * @param {Object} e - The button object of the operation
 */
function operationPress(e) {
    // check first if there was a previous operation
    if(currentOperator != ''){
        equate();
        // we then keep this operator for the next.
        currentOperator = e.currentTarget.textContent;
        //display.textContent = valueA;
        overwriteDisplay = true;
    }
    //
    // if there was no previous, set up for the upcoming operation
    else{
        // store the called operator
        currentOperator = e.currentTarget.textContent;
        // store the first value
        storeDisplayValue(display.textContent);
        // clear the display
        display.textContent = "0";
    }
}

/**
 * Event for pressing the equals button, or for finishing a previous operation.
 */
function equate(){
    // if there was no previous operation, do nothing.
    if(currentOperator === ''){
        return;
    }
    // if there was, operate.
    // store the second value
    storeDisplayValue(display.textContent);
    // store the result, and display it
    let result = operate(currentOperator, valueA, valueB);
    if(isNaN(Number(result))){
        clear();
        display.textContent = "ERROR";
        overwriteDisplay = true;
        return;
    }
    storeDisplayValue(result);
    displayRoundedValue();
    // clear current operator, enable chaining
    currentOperator = '';
    overwriteDisplay = true;
}

/**
 * Rounds the value of the operation if necessary.
 */
function displayRoundedValue(){
    // Case 1: A number well within char limit.
    if(valueA.toString().length < 18){
        display.textContent = valueA;
        return;
    }
    // Case 2: A number without scientific notation, limit to 15 digits
    let sigFigs = 16;
    // Case 3: A number with scientific notation, limit to 12 digits
    if (valueA.toString().length >= 18){
        sigFigs = 13;
    }
    display.textContent = valueA.toPrecision(sigFigs);
}

/**
 * Event: Clears the calculator of its memory.
 */
function clear(){
    display.textContent = '0';
    valueA = 0, valueB = 0;
    occupiedA = false, occupiedB = false;
    overwriteDisplay = false;
    currentOperator = '';
}

/**
 * Event: Deletes a character from the display.
 */
function deleteDisplayChar() {
    // display 0 if last number being deleted.
    if(display.textContent.length == 1){
        display.textContent = "0";
    }
    else{
        display.textContent = display.textContent.slice(0,-1);
    }
}

/**
 * Stores the current display value in memory. If there is no storage left,
 * overwrite A and wipe B.
 * @param {String} displayValue - A value to be stored in memory.
 */
function storeDisplayValue(displayValue){
    if (occupiedA) {
        if (occupiedB) {
            valueA = Number(displayValue);
            occupiedA = true;
            valueB = 0;
            occupiedB = false;
        }
        else {
            valueB = Number(displayValue);
            occupiedB = true;
        }
    }
    else {
        valueA = Number(displayValue);
        occupiedA = true;
    }
}

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
                return "ERROR";
            }
            return divide(a, b);
            break;
        default:
            return null;
    }
}