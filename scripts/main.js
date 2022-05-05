window.onload = () => {
    // variables
    var lastNumber;
    var lastOperator;
    var insertNewNumber = false;
    var calcClickedRecently = false;

    let themeSwitch = document.getElementsByClassName('theme-switch')[0];
    let btnNumbers = document.getElementsByClassName('button-number');
    let btnDot = document.getElementById('button-dot');
    let btnPlus = document.getElementById('button-plus');
    let btnMinus= document.getElementById('button-minus');
    let btnTimes = document.getElementById('button-times');
    let btnSlash = document.getElementById('button-slash');
    let btnDelete = document.getElementById('button-delete');
    let btnReset = document.getElementById('button-reset');
    let btnCalculate = document.getElementById('button-calculate');
    
    // register event listeners
    window.addEventListener('resize', initOutputWidth);
    themeSwitch.addEventListener('click', onThemeSwitchClick);
    for (let btnNumber of btnNumbers) {
        btnNumber.addEventListener('click', onNumberClick);
    }
    btnDot.addEventListener('click', onDotClick);
    btnPlus.addEventListener('click', onOperatorClick);
    btnMinus.addEventListener('click', onOperatorClick);
    btnTimes.addEventListener('click', onOperatorClick);
    btnSlash.addEventListener('click', onOperatorClick);
    btnDelete.addEventListener('click', deleteLastOutputChar);
    btnReset.addEventListener('click', resetCalculation);
    btnCalculate.addEventListener('click', showCalculationResult);
    
    init();

    function init() {
        initOutputWidth();
        initTheme();
        initResult();

        function initTheme() {
            let lastSavedTheme = localStorage.getItem('last-theme');
            if (lastSavedTheme != null) { // set last saved theme if exists
                changeTheme(lastSavedTheme);
            }
        }

        function initResult() {
            let lastSavedResult = sessionStorage.getItem('last-result');
            if (lastSavedResult != null) { // show last result if exists
                document.getElementById('result').innerText = lastSavedResult;
            }
        }
    }

    function initOutputWidth() {
        let mainElmnt = document.querySelector('main');
        let outputElmnt = document.getElementById('result');

        outputElmnt.style.maxWidth = `${mainElmnt.clientWidth} px`;
    }

    function onThemeSwitchClick() {
        switch (document.body.dataset.theme) {
            case 'theme-1':
                changeTheme('theme-2');
                break;
            case 'theme-2':
                changeTheme('theme-3');
                break;
            case 'theme-3':
                changeTheme('theme-1');
                break;
        }
    }
    
    function changeTheme(name) {
        let themeSwitchToggle = document.querySelector('.theme-switch .theme-switch-toggle');
        switch(name) {
            case 'theme-1':
                document.body.dataset.theme = name;
                themeSwitchToggle.style.marginLeft = '0rem';
                localStorage.setItem('last-theme', name);
                break;
            case 'theme-2':
                document.body.dataset.theme = name;
                themeSwitchToggle.style.marginLeft = '0.6rem';
                localStorage.setItem('last-theme', name);
                break;
            case 'theme-3':
                document.body.dataset.theme = name;
                themeSwitchToggle.style.marginLeft = '1.2rem';
                localStorage.setItem('last-theme', name);
                break;
        }
    }

    function onNumberClick(event) {
        let currentOutput = getOutput();
        let number = {
            'button-0': 0,
            'button-1': 1,
            'button-2': 2,
            'button-3': 3,
            'button-4': 4,
            'button-5': 5,
            'button-6': 6,
            'button-7': 7,
            'button-8': 8,
            'button-9': 9,
        }[event.target.id];

        if (currentOutput == '0' || insertNewNumber) {
            setOutput(number);
            insertNewNumber = false;
        } else {
            setOutput(currentOutput.concat(number));
        }
    }

    function onDotClick() {
        let currentOutput = getOutput();
        if (!currentOutput.includes('.')) { // only concat dot if one does not exist yet
            setOutput(currentOutput.concat('.'));
        }
    }

    function onOperatorClick(event) {
        let operator = {
            'button-plus': '+',
            'button-minus': '-',
            'button-times': '*',
            'button-slash': '/'
        }[event.target.id];
        let currentNumber = getOutput();

        if (lastNumber === undefined) {
            lastNumber = currentNumber;
        } else {
            if (lastOperator !== undefined ) {
                lastNumber = calculate(lastNumber, lastOperator, currentNumber);
            }
        }
        lastOperator = operator;
        insertNewNumber = true;
        calcClickedRecently = false;
    }

    function showCalculationResult() {
        if (!calcClickedRecently) {
            let currentNumber = getOutput();
            lastNumber = calculate(lastNumber, lastOperator, currentNumber);
            setOutput(lastNumber);
            calcClickedRecently = true;
            lastOperator = undefined;
        }
    }

    function calculate(number1, operator, number2) {
        let result;
        console.log(number1, operator, number2);
        result = eval(number1 + operator + number2);
        console.log('= ', result);
        return result;
    }

    function deleteLastOutputChar() {
        let currentOutput = getOutput();
        let newOutput = currentOutput.substring(0, currentOutput.length-1);
        if (newOutput.length != 0) { // only delete last char if new output is not empty and if its empty show 0
            setOutput(newOutput);
        } else {
            setOutput(0);
        }
    }

    function resetCalculation() {
        setOutput(0);
        // reset all global variables to default
        lastNumber = undefined;
        lastOperator = undefined;
        insertNewNumber = false;
    }

    function getOutput() {
        let outputElmnt = document.getElementById('result');
        let output = outputElmnt.textContent;
        return output;
    }

    function setOutput(text) {
        // set output
        let outputElmnt = document.getElementById('result');
        outputElmnt.textContent = text;

        // set the last result saved in session storage to new output
        sessionStorage.setItem('last-result', text);
    }
}