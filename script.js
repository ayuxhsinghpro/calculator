const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

let currentNumber = "0";
let previousNumber = "";
let operation = null;
let resetScreen = false;


// Update calculator display
function updateDisplay() {
    currentDisplay.textContent = currentNumber;
    previousDisplay.textContent =
        operation && previousNumber ?
        `${previousNumber} ${getOperationSymbol(operation)}` :
        "";
}


// Add number to display
function appendNumber(number) {

    if (resetScreen) {
        currentNumber = "0";
        resetScreen = false;
    }

    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    if (currentNumber === "0" && number !== ".") {
        currentNumber = number;
    } else {
        currentNumber += number;
    }

    updateDisplay();
}


// Select mathematical operation
function chooseOperation(selectedOperation) {

    if (currentNumber === "Error") {
        clearCalculator();
        return;
    }

    if (operation !== null && !resetScreen) {
        calculate();
    }

    previousNumber = currentNumber;
    operation = selectedOperation;
    resetScreen = true;

    updateDisplay();
}


// Perform calculation
function calculate() {

    if (operation === null || previousNumber === "") {
        return;
    }

    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);

    let result;

    switch (operation) {

        case "add":
            result = firstNumber + secondNumber;
            break;

        case "subtract":
            result = firstNumber - secondNumber;
            break;

        case "multiply":
            result = firstNumber * secondNumber;
            break;

        case "divide":

            if (secondNumber === 0) {
                currentNumber = "Error";
                previousNumber = "";
                operation = null;
                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    // Remove unnecessary decimal digits
    currentNumber = parseFloat(result.toFixed(10)).toString();

    previousNumber = "";
    operation = null;
    resetScreen = true;

    updateDisplay();
}


// Clear calculator
function clearCalculator() {

    currentNumber = "0";
    previousNumber = "";
    operation = null;
    resetScreen = false;

    updateDisplay();
}


// Delete last digit
function deleteNumber() {

    if (resetScreen || currentNumber === "Error") {
        return;
    }

    if (currentNumber.length === 1) {
        currentNumber = "0";
    } else {
        currentNumber = currentNumber.slice(0, -1);
    }

    updateDisplay();
}


// Percentage
function percentage() {

    if (currentNumber === "Error") {
        return;
    }

    currentNumber = (parseFloat(currentNumber) / 100).toString();

    updateDisplay();
}


// Get operation symbol
function getOperationSymbol(operation) {

    const symbols = {
        add: "+",
        subtract: "−",
        multiply: "×",
        divide: "÷"
    };

    return symbols[operation];
}


// Button click events
document.querySelectorAll("[data-number]").forEach(button => {

    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });

});


document.querySelectorAll("[data-operation]").forEach(button => {

    button.addEventListener("click", () => {
        chooseOperation(button.dataset.operation);
    });

});


document.querySelectorAll("[data-action]").forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteNumber();
        }

        if (action === "percent") {
            percentage();
        }

        if (action === "equals") {
            calculate();
        }

    });

});


// Keyboard support
document.addEventListener("keydown", event => {

    const key = event.key;

    if (!isNaN(key) || key === ".") {
        appendNumber(key);
    }

    if (key === "+") {
        chooseOperation("add");
    }

    if (key === "-") {
        chooseOperation("subtract");
    }

    if (key === "*") {
        chooseOperation("multiply");
    }

    if (key === "/") {
        event.preventDefault();
        chooseOperation("divide");
    }

    if (key === "Enter" || key === "=") {
        calculate();
    }

    if (key === "Escape") {
        clearCalculator();
    }

    if (key === "Backspace") {
        deleteNumber();
    }

    if (key === "%") {
        percentage();
    }

});