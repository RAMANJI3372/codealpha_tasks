const previousOperandElement =
    document.getElementById("previousOperand");

const currentOperandElement =
    document.getElementById("currentOperand");

const historyPanel =
    document.getElementById("historyPanel");

const historyList =
    document.getElementById("historyList");

const historyToggle =
    document.getElementById("historyToggle");

const closeHistory =
    document.getElementById("closeHistory");

const clearHistoryButton =
    document.getElementById("clearHistory");


let currentOperand = "";

let previousOperand = "";

let operation = null;

let shouldResetScreen = false;


function appendNumber(number) {

    if (shouldResetScreen) {

        currentOperand = "";

        shouldResetScreen = false;
    }


    if (number === "." && currentOperand.includes(".")) {
        return;
    }


    if (currentOperand === "0" && number !== ".") {

        currentOperand = number;

    } else {

        currentOperand += number;
    }


    updateDisplay();
}



function chooseOperation(operator) {

    if (currentOperand === "" && previousOperand === "") {
        return;
    }


    if (currentOperand !== "" && previousOperand !== "") {

        calculate();
    }


    operation = operator;

    previousOperand = currentOperand;

    currentOperand = "";

    updateDisplay();
}


function calculate() {

    if (
        previousOperand === "" ||
        currentOperand === "" ||
        operation === null
    ) {
        return;
    }


    const previous = parseFloat(previousOperand);

    const current = parseFloat(currentOperand);

    let result;


    switch (operation) {

        case "+":
            result = previous + current;
            break;

        case "-":
            result = previous - current;
            break;

        case "*":
            result = previous * current;
            break;

        case "/":

            if (current === 0) {

                currentOperand = "Error";

                previousOperand = "";

                operation = null;

                updateDisplay();

                return;
            }

            result = previous / current;

            break;

        default:
            return;
    }


    result = parseFloat(result.toFixed(10));


    const expression =
        `${previous} ${getOperatorSymbol(operation)} ${current}`;


    addToHistory(expression, result);


    currentOperand = result.toString();

    previousOperand = "";

    operation = null;

    shouldResetScreen = true;


    updateDisplay();
}



function getOperatorSymbol(operator) {

    switch (operator) {

        case "+":
            return "+";

        case "-":
            return "−";

        case "*":
            return "×";

        case "/":
            return "÷";

        default:
            return operator;
    }
}


function clearCalculator() {

    currentOperand = "";

    previousOperand = "";

    operation = null;

    shouldResetScreen = false;

    updateDisplay();
}


function backspace() {

    if (shouldResetScreen) {
        return;
    }


    currentOperand =
        currentOperand.slice(0, -1);


    updateDisplay();
}


function percentage() {

    if (currentOperand === "") {
        return;
    }


    currentOperand =
        (parseFloat(currentOperand) / 100).toString();


    updateDisplay();
}



function updateDisplay() {

    currentOperandElement.textContent =
        currentOperand || "0";


    if (operation !== null && previousOperand !== "") {

        previousOperandElement.textContent =
            `${previousOperand} ${getOperatorSymbol(operation)}`;

    } else {

        previousOperandElement.textContent =
            "";
    }
}


function getHistory() {

    return JSON.parse(
        localStorage.getItem("calculatorHistory")
    ) || [];
}


function saveHistory(history) {

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );
}


function addToHistory(expression, result) {

    const history = getHistory();


    history.unshift({
        expression: expression,
        result: result,
        date: new Date().toLocaleTimeString()
    });


    if (history.length > 20) {

        history.pop();
    }


    saveHistory(history);

    renderHistory();
}


function renderHistory() {

    const history = getHistory();


    if (history.length === 0) {

        historyList.innerHTML = `

            <div class="empty-history">

                <div>🧮</div>

                <p>No calculations yet</p>

            </div>

        `;

        return;
    }


    historyList.innerHTML = "";


    history.forEach((item, index) => {

        const historyItem =
            document.createElement("div");


        historyItem.classList.add(
            "history-item"
        );


        historyItem.innerHTML = `

            <div class="history-expression">

                ${item.expression}

            </div>

            <div class="history-result">

                = ${item.result}

            </div>

        `;


        historyItem.addEventListener(
            "click",
            () => {

                currentOperand =
                    item.result.toString();

                previousOperand = "";

                operation = null;

                shouldResetScreen = false;

                updateDisplay();

                historyPanel.classList.remove(
                    "active"
                );
            }
        );


        historyList.appendChild(
            historyItem
        );

    });
}



clearHistoryButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "calculatorHistory"
        );

        renderHistory();
    }
);


historyToggle.addEventListener(
    "click",
    () => {

        historyPanel.classList.add(
            "active"
        );

        renderHistory();
    }
);

closeHistory.addEventListener(
    "click",
    () => {

        historyPanel.classList.remove(
            "active"
        );
    }
);

document
    .querySelectorAll("[data-number]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                appendNumber(
                    button.dataset.number
                );

            }
        );

    });


document
    .querySelectorAll("[data-operator]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                chooseOperation(
                    button.dataset.operator
                );

            }
        );

    });


document
    .querySelector('[data-action="clear"]')
    .addEventListener(
        "click",
        clearCalculator
    );


document
    .querySelector('[data-action="backspace"]')
    .addEventListener(
        "click",
        backspace
    );


document
    .querySelector('[data-action="percentage"]')
    .addEventListener(
        "click",
        percentage
    );


document
    .querySelector('[data-action="calculate"]')
    .addEventListener(
        "click",
        calculate
    );


document.addEventListener(
    "keydown",
    event => {

        const key = event.key;

        if (
            (key >= "0" && key <= "9") ||
            key === "."
        ) {

            appendNumber(key);

            return;
        }

        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            chooseOperation(key);

            return;
        }

        if (key === "Enter" || key === "=") {

            event.preventDefault();

            calculate();

            return;
        }


        if (key === "Backspace") {

            backspace();

            return;
        }

        if (key === "Escape") {

            clearCalculator();

            return;
        }


        if (key === "%") {

            percentage();

        }

    }
);



renderHistory();

updateDisplay();