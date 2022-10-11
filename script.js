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
    // debug button listener
    const allBtns = document.querySelectorAll("button");
    // numbers: append number to display
    btnNumbers.forEach((btnNumber) => {
        btnNumber.addEventListener('click', () => {
            // block multiple decimals
            if(btnNumber.textContent == "." && display.textContent.includes(".")){
                return;
            }
            // block input after a certain length
            if(display.textContent.length >= 18){
                return;
            }
            // if current value is "0", overwrite it unless decimal
            if(display.textContent == "0" && btnNumber.textContent != "."){ 
                display.textContent = ""; 
            }
            // if we can overwrite the result 
            // ex. if we did 6+9, 15 will be displayed but we can overwrite by
            // pressing another button
            if(overwriteDisplay){
                display.textContent = btnNumber.textContent;
                overwriteDisplay = false;
            }
            else{
                display.textContent += btnNumber.textContent;
            }
        });
    });

    // clear: empty display text
    btnClear.addEventListener('click', clear);

    // delete: trim the display text by 1
    btnDelete.addEventListener('click', () => {
        // display 0 if last number being deleted.
        if(display.textContent.length == 1){
            display.textContent = "0";
        }
        else{
            display.textContent = display.textContent.slice(0,-1);
        }

    });

    // operators
    btnOperators.forEach((btnOperator) => {
        btnOperator.addEventListener('click', () => {
            console.log(btnOperator.textContent + "current:" + currentOperator);
            // check first if there was a previous operation
            if(currentOperator != ''){
                equate();
                console.log("hi");
                // we then keep this operator for the next.
                currentOperator = btnOperator.textContent;
                //display.textContent = valueA;
                overwriteDisplay = true;
            }
            //
            // if there was no previous, set up for the upcoming operation
            else{
                // store the called operator
                currentOperator = btnOperator.textContent;
                // store the first value
                storeDisplayValue(display.textContent);
                // clear the display
                display.textContent = "0";
            }
        })
    })

     // equals
    btnEquals.addEventListener('click', () => {
        equate();
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
    });

    allBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            console.log(`valueA:${valueA}, occupiedA:${occupiedA}, valueB:${valueB}, occupiedB:${occupiedB}, currentOperator:${currentOperator}, Button Pressed:${btn.textContent}`);
        })
    })

}

/**
 * Event for pressing the equals button, or for finishing a previous operation.
 */
function equate(){
    // if there was no previous operation, do nothing.
    if(currentOperator === ''){
        console.log("equate: no current")
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
    console.log("test");
    storeDisplayValue(result);
    display.textContent = valueA;
    // clear current operator, enable chaining
    currentOperator = '';
    overwriteDisplay = true;
}

/**
 * Clears the calculator of its memory.
 */
function clear(){
    display.textContent = '0';
    valueA = 0, valueB = 0;
    occupiedA = false, occupiedB = false;
    overwriteDisplay = false;
    currentOperator = '';
}

/**
 * Stores the current display value in memory. If there is no storage left,
 * overwrite A and wipe B.
 */
function storeDisplayValue(displayValue){
    console.log("Storing: " + displayValue);
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
            console.log("valueB: " + valueB + " occupiedB: " + occupiedB);
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
                return "error";
            }
            return divide(a, b);
            break;
        default:
            return null;
    }
}