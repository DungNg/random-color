import { randomInRange } from './randomListNumber.js';
import { sortColorsByHue } from './sort-color.js';

let container = document.querySelector('.container');
let dialog = document.querySelector('.dialog');
let restartBtn = document.querySelector('.restart');
let sortBtn = document.querySelector('.sort');
let lightModeBtn = document.querySelector('.light-mode');
let funcContainer = document.querySelector('.func-container');

let [initialFlag, index, number, isLightColorFlag] = [true, 0, 0, false];
let listColor = [];
let speed = 0;
let sortFlag = false;
let mainLoop = null;
let [begin, end] = [0, 0];

const lbLight = 'light  😑';
const lbDark = 'dark  😎';
const DARK_MODE = 'dark-mode';
const LIGHT_MODE = 'light-mode';

if (typeof dialog.showModal !== 'function') {
    dialog.none = true;
}

function changeElementColor(mode, element) {
    if (mode === LIGHT_MODE) {
        element.classList.add(LIGHT_MODE);
        element.classList.remove(DARK_MODE);
    }

    if (mode === DARK_MODE) {
        element.classList.add(DARK_MODE);
        element.classList.remove(LIGHT_MODE);
    }
}

function saveLightOrDarkMode(state) {
    localStorage.setItem('rcLightMode', state);
}

function getLightOrDarkMode() {
    return localStorage.getItem('rcLightMode') || 'dark-mode';
}

function changeTitleLightDark(element, text) {
    element.innerHTML = text;
}

function loadLightOrDarkMode() {
    let lightMode = localStorage.getItem('rcLightMode');
    if (lightMode == null) {
        document.body.classList.add(DARK_MODE);
        changeTitleLightDark(lightModeBtn, lbLight);
        changeElementColor(DARK_MODE, lightModeBtn);
    }

    if (lightMode === LIGHT_MODE) {
        document.body.classList.add(LIGHT_MODE);
        changeTitleLightDark(lightModeBtn, lbDark);
        changeElementColor(lightMode, lightModeBtn);
    }

    if (lightMode === DARK_MODE) {
        document.body.classList.add(DARK_MODE);
        changeTitleLightDark(lightModeBtn, lbLight);
        changeElementColor(lightMode, lightModeBtn);
    }
}
loadLightOrDarkMode();

dialog.addEventListener('click', function (event) {
    var rect = dialog.getBoundingClientRect();
    var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
        && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
        dialog.close();
    }
});

function getRandomColor() {
    var letters = '0123456789ABCDEF',
        color = '#',
        generatedNumber,
        i;
    for (i = 0; i < 6; i++) {
        generatedNumber = Math.floor(Math.random() * 16);
        color += letters[generatedNumber];
    }
    return color;
}
let countDownMessage = null;
function copyToClipboard(string) {
    if (countDownMessage != null) {
        clearInterval(countDownMessage);
    }
    navigator.clipboard.writeText(string).then(res => {
        const message = document.querySelector('.message');
        let count = 4;
        let timeLoopMessage = 700;

        if (message.classList.contains('animate') === false) {
            let colorMode = getLightOrDarkMode();
            if (colorMode === LIGHT_MODE) {
                message.style.backgroundColor = 'black';
                message.style.color = 'white';
            }

            if (colorMode === DARK_MODE) {
                message.style.backgroundColor = 'white';
                message.style.color = 'black';
            }
            message.classList.add('animate');
            message.style.visibility = 'visible';
        }

        message.innerHTML = `${string} copied to clipboard!`;

        countDownMessage = setInterval(() => {
            if (count === 0) {
                message.classList.remove('animate');
                message.innerHTML = '';
                message.style.padding = '';
                message.style.visibility = 'hidden';
                clearInterval(countDownMessage);
                countDownMessage = null;
            }
            count--;
        }, timeLoopMessage);
    })
}


function isLightColor(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

        r = color[1];
        g = color[2];
        b = color[3];
    }
    else {

        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace(
            color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

        return true; //light
    }
    else {

        return false; //dark
    }
}

function generateRandomColorList(length) {
    let result = [];
    for (let index = 0; index < length; index++) {
        result.push(getRandomColor());
    }
    return result;
}

let showElement = function (element, display = 'block') {
    element.style.display = display;
    setTimeout(() => element.classList.add("animate"), speed);
}

let hideElement = function (element) {
    element.style.display = 'none';
    element.classList.remove("animate");
}

sortBtn.innerHTML = 'sort';
sortBtn.addEventListener('click', () => {
    index = 0;
    sortFlag = true;
    container.replaceChildren();
    hideElement(funcContainer);
    mainLoop = newLoop();
})

restartBtn.innerHTML = 'restart';
restartBtn.addEventListener('click', () => {
    index = 0;
    initialFlag = true;
    container.replaceChildren();
    hideElement(funcContainer);
    mainLoop = newLoop();
})

lightModeBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode') === true) {
        changeElementColor(LIGHT_MODE, document.body);
        changeElementColor(LIGHT_MODE, lightModeBtn);
        changeTitleLightDark(lightModeBtn, lbDark);
        saveLightOrDarkMode(LIGHT_MODE);
        return;
    }

    if (document.body.classList.contains('light-mode') === true) {
        changeElementColor(DARK_MODE, document.body);
        changeElementColor(DARK_MODE, lightModeBtn);
        changeTitleLightDark(lightModeBtn, lbLight);
        saveLightOrDarkMode(DARK_MODE);
        return;
    }
})

let mainFunc = function () {
    if (initialFlag === true) {
        number = randomInRange(1, 1000);
        listColor = generateRandomColorList(number);
    }

    if (sortFlag === true) {
        const beginSort = new Date().getTime();
        listColor = sortColorsByHue(listColor);
        const endSort = new Date().getTime();
        console.log('Estimated sort time is ' + (endSort - beginSort) + 'ms');
        sortFlag = false;
    }

    if (index < number) {
        const item = listColor[index];
        initialFlag = false;
        const element = document.createElement('div');
        element.className = 'box';
        element.style.backgroundColor = item;

        container.appendChild(element);
        setTimeout(() => element.classList.add("animate"), speed);

        element.addEventListener('click', function () {
            dialog.style.backgroundColor = item;
            dialog.innerHTML = `${item}`;
            isLightColorFlag = isLightColor(item);
            changeElementColor(isLightColorFlag === true ? LIGHT_MODE : DARK_MODE, dialog);

            const button = document.createElement('button');
            button.innerHTML = "copy";
            changeElementColor(isLightColorFlag === true ? LIGHT_MODE : DARK_MODE, button);
            button.classList.add('btn-copy');
            button.addEventListener('click', () => {
                copyToClipboard(item);
            });

            dialog.appendChild(button);
            dialog.showModal();
        })

        if (index === number - 1) {
            showElement(funcContainer, 'flex');
            clearInterval(mainLoop);
            mainLoop = null;
            end = new Date().getTime();
            console.log('Estimated time is ' + (end - begin) + 'ms');
        }
        window.scrollTo(0, document.body.scrollHeight);
        index++;
    }
}

let newLoop = () => {
    console.log('Create new loop');
    begin = new Date().getTime();
    return setInterval(() => {
        mainFunc();
    }, speed);
}

mainLoop = newLoop();
