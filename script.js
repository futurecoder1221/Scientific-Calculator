// ==========================================
// SCIENTIFIC CALCULATOR - FINAL VERSION
// ==========================================

const display = document.getElementById("display");
const expressionDisplay = document.getElementById("expression");
const modeText = document.getElementById("modeText");
const shiftIndicator = document.getElementById("shiftIndicator");

const shiftBtn = document.getElementById("shiftBtn");
const alphaBtn = document.getElementById("alphaBtn");
const replayBtn = document.getElementById("replayBtn");
const degRadBtn = document.getElementById("degRadBtn");
const onBtn = document.getElementById("onBtn");

const sinBtn = document.getElementById("sinBtn");
const cosBtn = document.getElementById("cosBtn");
const tanBtn = document.getElementById("tanBtn");
const screen = document.getElementById("screen");

let expression = "";
let answer = 0;
let memory = 0;

let angleMode = "DEG";

let shiftMode = false;
let alphaMode = false;
let calculatorOn = true;

let history = [];
let historyIndex = -1;


// ==========================================
// DISPLAY
// ==========================================

function updateDisplay() {

    if (!calculatorOn) {
        display.textContent = "";
        expressionDisplay.textContent = "";
        return;
    }

    expressionDisplay.textContent = expression;
    display.textContent = expression || "0";
}


// ==========================================
// MODE INDICATORS
// ==========================================

function updateModes() {

    let indicators = [];

    if (shiftMode) {
        indicators.push("SHIFT");
    }

    if (alphaMode) {
        indicators.push("ALPHA");
    }

    shiftIndicator.textContent = indicators.join(" ");

    if (shiftMode) {
        sinBtn.textContent = "sin⁻¹";
        cosBtn.textContent = "cos⁻¹";
        tanBtn.textContent = "tan⁻¹";
    } else {
        sinBtn.textContent = "sin";
        cosBtn.textContent = "cos";
        tanBtn.textContent = "tan";
    }
}


function resetModes() {
    shiftMode = false;
    alphaMode = false;
    updateModes();
}


// ==========================================
// ANGLE FUNCTIONS
// ==========================================

function toRadians(value) {

    if (angleMode === "DEG") {
        return value * Math.PI / 180;
    }

    return value;
}


function fromRadians(value) {

    if (angleMode === "DEG") {
        return value * 180 / Math.PI;
    }

    return value;
}


// ==========================================
// FACTORIAL
// ==========================================

function factorial(n) {

    if (
        n < 0 ||
        !Number.isInteger(n) ||
        n > 170
    ) {
        throw new Error("Math Error");
    }

    let result = 1;

    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    return result;
}


// ==========================================
// GET CURRENT VALUE
// ==========================================

function getCurrentValue() {

    if (expression === "") {
        return answer;
    }

    const result = Function(
        '"use strict"; return (' + expression + ')'
    )();

    if (
        typeof result !== "number" ||
        !Number.isFinite(result)
    ) {
        throw new Error("Math Error");
    }

    return result;
}


// ==========================================
// FORMAT RESULT
// ==========================================

function formatResult(result) {

    if (!Number.isFinite(result)) {
        throw new Error("Math Error");
    }

    if (Math.abs(result) < 1e-12) {
        return 0;
    }

    if (Number.isInteger(result)) {
        return result;
    }

    return Number(result.toPrecision(12));
}


// ==========================================
// CALCULATOR OFF
// ==========================================

function turnOff() {

    calculatorOn = false;

    expression = "";

    resetModes();

    display.textContent = "";
    expressionDisplay.textContent = "";
    modeText.textContent = "";

    screen.style.opacity = "0.25";
}


// ==========================================
// CALCULATOR ON
// ==========================================

function turnOn() {

    calculatorOn = true;

    expression = "";
    angleMode = "DEG";

    resetModes();

    modeText.textContent = "DEG";

    screen.style.opacity = "1";

    expressionDisplay.textContent = "";
    display.textContent = "0";
}


// ==========================================
// SHIFT
// ==========================================

shiftBtn.addEventListener("click", function () {

    if (!calculatorOn) return;

    shiftMode = !shiftMode;

    if (shiftMode) {
        alphaMode = false;
    }

    updateModes();
});


// ==========================================
// ALPHA
// ==========================================

alphaBtn.addEventListener("click", function () {

    if (!calculatorOn) return;

    alphaMode = !alphaMode;

    if (alphaMode) {
        shiftMode = false;
    }

    updateModes();
});


// ==========================================
// ON
// ==========================================

onBtn.addEventListener("click", function () {

    if (!calculatorOn) {
        turnOn();
    }
});


// ==========================================
// DEG / RAD
// ==========================================

degRadBtn.addEventListener("click", function () {

    if (!calculatorOn) return;

    angleMode =
        angleMode === "DEG"
            ? "RAD"
            : "DEG";

    modeText.textContent = angleMode;
});


// ==========================================
// REPLAY
// ==========================================

replayBtn.addEventListener("click", function () {

    if (!calculatorOn) return;


    // ALPHA + REPLAY = MEMORY RECALL
    if (alphaMode) {

        expression = memory.toString();

        expressionDisplay.textContent = "Memory Recall";

        display.textContent = memory;

        resetModes();

        return;
    }


    // NORMAL REPLAY = HISTORY
    if (history.length === 0) {

        expressionDisplay.textContent = "No History";
        display.textContent = "0";

        return;
    }

    historyIndex--;

    if (historyIndex < 0) {
        historyIndex = history.length - 1;
    }

    const item = history[historyIndex];

    expressionDisplay.textContent =
        item.expression + " =";

    display.textContent =
        item.result;

    expression =
        item.result.toString();
});


// ==========================================
// NORMAL VALUE BUTTONS
// ==========================================

document
    .querySelectorAll("[data-value]")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            if (!calculatorOn) return;

            expression += button.dataset.value;

            updateDisplay();
        });
    });


// ==========================================
// ACTION BUTTONS
// ==========================================

document
    .querySelectorAll("[data-action]")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            if (!calculatorOn) return;

            const action = button.dataset.action;

            try {

                // ===============================
                // AC / SHIFT + AC
                // ===============================

                if (action === "clear") {

                    if (shiftMode) {
                        turnOff();
                        return;
                    }

                    expression = "";

                    expressionDisplay.textContent = "";
                    display.textContent = "0";

                    resetModes();

                    return;
                }


                // ===============================
                // DELETE
                // ===============================

                if (action === "delete") {

                    expression =
                        expression.slice(0, -1);

                    updateDisplay();

                    resetModes();

                    return;
                }


                // ===============================
                // ANS / ALPHA + ANS
                // ===============================

                if (action === "ans") {

                    // Save answer to memory
                    if (alphaMode) {

                        memory = answer;

                        expressionDisplay.textContent =
                            "Stored in Memory";

                        display.textContent =
                            memory;

                        resetModes();

                        return;
                    }

                    expression +=
                        answer.toString();

                    updateDisplay();

                    resetModes();

                    return;
                }


                // ===============================
                // PI
                // ===============================

                if (action === "pi") {

                    expression +=
                        Math.PI.toString();

                    updateDisplay();

                    resetModes();

                    return;
                }


                // ===============================
                // e
                // ===============================

                if (action === "exp") {

                    expression +=
                        Math.E.toString();

                    updateDisplay();

                    resetModes();

                    return;
                }


                // ===============================
                // POWER
                // ===============================

                if (action === "power") {

                    expression += "**";

                    updateDisplay();

                    resetModes();

                    return;
                }


                // ===============================
                // PERCENT
                // ===============================

                if (action === "percent") {

                    expression += "/100";

                    updateDisplay();

                    resetModes();

                    return;
                }


                // ===============================
                // SCIENTIFIC NOTATION
                // ===============================

                if (
                    action ===
                    "scientificNotation"
                ) {

                    expression += "*10**";

                    updateDisplay();

                    resetModes();

                    return;
                }


                let value =
                    getCurrentValue();

                let result;


                // ===============================
                // SCIENTIFIC FUNCTIONS
                // ===============================

                switch (action) {

                    case "square":

                        result =
                            value ** 2;

                        break;


                    case "sqrt":

                        if (value < 0) {
                            throw new Error();
                        }

                        result =
                            Math.sqrt(value);

                        break;


                    case "reciprocal":

                        if (value === 0) {
                            throw new Error();
                        }

                        result =
                            1 / value;

                        break;


                    // SIN / SIN INVERSE
                    case "sin":

                        if (shiftMode) {

                            if (
                                value < -1 ||
                                value > 1
                            ) {
                                throw new Error();
                            }

                            result =
                                fromRadians(
                                    Math.asin(value)
                                );

                        } else {

                            result =
                                Math.sin(
                                    toRadians(value)
                                );
                        }

                        break;


                    // COS / COS INVERSE
                    case "cos":

                        if (shiftMode) {

                            if (
                                value < -1 ||
                                value > 1
                            ) {
                                throw new Error();
                            }

                            result =
                                fromRadians(
                                    Math.acos(value)
                                );

                        } else {

                            result =
                                Math.cos(
                                    toRadians(value)
                                );
                        }

                        break;


                    // TAN / TAN INVERSE
                    case "tan":

                        if (shiftMode) {

                            result =
                                fromRadians(
                                    Math.atan(value)
                                );

                        } else {

                            if (
                                angleMode === "DEG" &&
                                Math.abs(
                                    Math.cos(
                                        toRadians(value)
                                    )
                                ) < 1e-12
                            ) {
                                throw new Error();
                            }

                            result =
                                Math.tan(
                                    toRadians(value)
                                );
                        }

                        break;


                    case "log":

                        if (value <= 0) {
                            throw new Error();
                        }

                        result =
                            Math.log10(value);

                        break;


                    case "ln":

                        if (value <= 0) {
                            throw new Error();
                        }

                        result =
                            Math.log(value);

                        break;


                    case "factorial":

                        result =
                            factorial(value);

                        break;


                    case "tenPower":

                        result =
                            10 ** value;

                        break;


                    case "expPower":

                        result =
                            Math.exp(value);

                        break;


                    case "calculate":

                        if (expression === "") {
                            return;
                        }

                        result =
                            getCurrentValue();

                        break;


                    default:
                        return;
                }


                result =
                    formatResult(result);


                // ===============================
                // SAVE HISTORY
                // ===============================

                const oldExpression =
                    expression;

                if (oldExpression !== "") {

                    history.push({

                        expression:
                            oldExpression,

                        result:
                            result
                    });

                    if (
                        history.length > 20
                    ) {
                        history.shift();
                    }

                    historyIndex =
                        history.length;
                }


                answer = result;


                expressionDisplay.textContent =
                    oldExpression + " =";

                display.textContent =
                    result;

                expression =
                    result.toString();


                resetModes();

            }

            catch (error) {

                expression = "";

                expressionDisplay.textContent =
                    "";

                display.textContent =
                    "Math Error";

                resetModes();
            }
        });
    });


// ==========================================
// KEYBOARD SUPPORT
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (!calculatorOn) {

            // O key can turn calculator ON
            if (
                event.key === "o" ||
                event.key === "O"
            ) {
                turnOn();
            }

            return;
        }


        const key =
            event.key;


        // NUMBERS
        if (/^[0-9]$/.test(key)) {

            expression += key;

            updateDisplay();

            return;
        }


        // DECIMAL
        if (key === ".") {

            expression += ".";

            updateDisplay();

            return;
        }


        // OPERATORS
        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            expression += key;

            updateDisplay();

            return;
        }


        // BRACKETS
        if (
            key === "(" ||
            key === ")"
        ) {

            expression += key;

            updateDisplay();

            return;
        }


        // BACKSPACE
        if (key === "Backspace") {

            expression =
                expression.slice(0, -1);

            updateDisplay();

            return;
        }


        // ESC = AC
        if (key === "Escape") {

            expression = "";

            expressionDisplay.textContent =
                "";

            display.textContent =
                "0";

            resetModes();

            return;
        }


        // ENTER OR = FOR CALCULATE
        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            const equalButton =
                document.querySelector(
                    '[data-action="calculate"]'
                );

            equalButton.click();
        }
    }
);


// ==========================================
// START
// ==========================================

// ==========================================
// INITIAL STATE - CALCULATOR STARTS OFF
// ==========================================

turnOff();