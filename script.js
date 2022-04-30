'use strict';
import { EQUATION } from './equation.js';
import infoModal from './infoModal.js';
import statsModal from './statsModal.js';

const btnDarkMode = document.getElementById('dark-mode');
const modal = document.querySelector('.modal-info-global');
const info = document.getElementById('info');
const closeInfoButton = document.querySelector('.close-info-button');
const modalStats = document.getElementById('modal-stats-global');
const closeStatsButton = document.getElementById('stats-close');
const stats = document.getElementById('stats');
const reset = document.getElementById('reset');
// const answerHtml = document.getElementsByClassName('hint');

const NUMBER_OF_GUESSES = 6;
const BOX_LENGTH = 7;
let guessesRemaining = NUMBER_OF_GUESSES;
let successRate = 0;
let currentStreak = 0;
let totalTries = 0;
let bestStreak = 0;
let currentGuess = [];
let statsDict = {};
let nextCharacter = 0;
let rightGuessEquation =
  Object.keys(EQUATION)[
    Math.floor(Math.random() * Object.keys(EQUATION).length)
  ];
let answer = EQUATION[rightGuessEquation];
let stored = localStorage['stats'];

infoModal.render();

if (stored) {
  statsDict = JSON.parse(stored);
  totalTries = statsDict[1];
  bestStreak = statsDict[2];
} else statsDict = { 1: totalTries, 2: bestStreak };

console.log(rightGuessEquation, answer);

function initBoard() {
  let board = document.getElementById('game-board');

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement('div');
    row.className = 'equation-row';

    for (let j = 0; j < BOX_LENGTH + 1; j++) {
      if (j == BOX_LENGTH) {
        let answerBox = document.createElement('div');
        answerBox.className = 'hint';
        row.appendChild(answerBox);
      } else {
        let box = document.createElement('div');
        box.className = 'equation-box';
        row.appendChild(box);
      }
    }

    board.appendChild(row);
  }
  showAnswer(answer);
}

function showAnswer(answer) {
  if (guessesRemaining === 0) {
    return;
  }
  let row =
    document.getElementsByClassName('equation-row')[
      NUMBER_OF_GUESSES - guessesRemaining
    ];
  let answerBox = row.children[row.children.length - 1];
  answerBox.textContent = `= ${answer} `;
}

function hideAnswer() {
  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.getElementsByClassName('equation-row')[i];
    let answerBox = row.children[row.children.length - 1];
    answerBox.textContent = '';
  }
}

function shadeKeyBoard(character, color) {
  for (const elem of document.getElementsByClassName('keyboard-button')) {
    if (elem.textContent === character) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === 'green') {
        return;
      }

      if (oldColor === 'yellow' && color !== 'green') {
        return;
      }
      elem.style.backgroundColor = color;
      break;
    }
  }
}

function deleteCharacter() {
  let row =
    document.getElementsByClassName('equation-row')[
      NUMBER_OF_GUESSES - guessesRemaining
    ];
  let box = row.children[nextCharacter - 1];
  let prevBox = row.children[nextCharacter - 2];
  box.removeEventListener('click', deleteCharacter);
  if (prevBox) {
    prevBox.addEventListener('click', deleteCharacter);
  }
  box.textContent = '';
  box.classList.remove('filled-box');
  animateCSS(box, 'flipInX');
  currentGuess.pop();
  nextCharacter -= 1;
}

function checkGuess() {
  let row =
    document.getElementsByClassName('equation-row')[
      NUMBER_OF_GUESSES - guessesRemaining
    ];
  let guessEquation = '';
  let rightGuess = Array.from(rightGuessEquation);

  for (const val of currentGuess) {
    guessEquation += val;
  }

  try {
    eval(guessEquation);
  } catch (error) {
    if (error instanceof SyntaxError) {
      toastr.error('Syntax Error');
      return;
    }
  }

  if (guessEquation.length != BOX_LENGTH) {
    toastr.error('Not enough Characters!');
    return;
  }

  if (eval(guessEquation) !== answer) {
    toastr.error('Equation is wrong!');
    return;
  }

  for (let i = 0; i < BOX_LENGTH; i++) {
    let characterColor = '';
    let box = row.children[i];
    let character = currentGuess[i];
    let characterPosition = rightGuess.indexOf(currentGuess[i]);
    // is Character in the correct guess
    if (characterPosition === -1) {
      characterColor = 'grey';
    } else {
      // now, Character is definitely in equation
      // if Character index and right guess index are the same
      // Character is in the right position
      if (currentGuess[i] === rightGuess[i]) {
        // shade green
        characterColor = 'green';
      } else {
        // shade box yellow
        characterColor = 'yellow';
      }

      rightGuess[characterPosition] = '#';
    }

    row.children[BOX_LENGTH - 1].removeEventListener('click', deleteCharacter);

    let delay = 250 * i;
    setTimeout(() => {
      //flip box
      animateCSS(box, 'flipInX');
      //shade box
      box.style.backgroundColor = characterColor;
      shadeKeyBoard(character, characterColor);
    }, delay);
  }
  currentStreak += 1;
  totalTries += 1;
  statsDict[1] = totalTries;

  if (guessEquation === rightGuessEquation) {
    toastr.success('You guessed right! Game over!');
    if (bestStreak === 0) bestStreak = currentStreak;
    if (bestStreak > currentStreak) bestStreak = currentStreak;
    statsDict[2] = bestStreak;
    successRate = Math.round((1 / currentStreak) * 100);
    guessesRemaining = 0;
    localStorage['stats'] = JSON.stringify(statsDict);
    return;
  } else {
    hideAnswer();
    guessesRemaining -= 1;
    showAnswer(answer);
    currentGuess = [];
    nextCharacter = 0;

    if (guessesRemaining === 0) {
      toastr.error("You've run out of guesses! Game over!");
      toastr.info(`The right equation was: "${rightGuessEquation}"`);
    }
  }

  localStorage['stats'] = JSON.stringify(statsDict);
}

function insertCharacter(pressedKey) {
  if (nextCharacter === BOX_LENGTH) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row =
    document.getElementsByClassName('equation-row')[
      NUMBER_OF_GUESSES - guessesRemaining
    ];
  let box = row.children[nextCharacter];
  let prevBox = row.children[nextCharacter - 1];
  if (prevBox) {
    prevBox.removeEventListener('click', deleteCharacter);
  }
  box.addEventListener('click', deleteCharacter);
  animateCSS(box, 'pulse');
  box.textContent = pressedKey;
  box.classList.add('filled-box');
  currentGuess.push(pressedKey);
  nextCharacter += 1;
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.style.setProperty('--animate-duration', '0.3s');

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });

document.addEventListener('keyup', e => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);
  if (pressedKey === 'Backspace' && nextCharacter !== 0) {
    deleteCharacter();
    return;
  }

  if (pressedKey === 'Enter') {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[0-9*/+-]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertCharacter(pressedKey);
  }
});

document.getElementById('keyboard-cont').addEventListener('click', e => {
  const target = e.target;

  if (!target.classList.contains('keyboard-button')) {
    return;
  }
  let key = target.textContent;

  if (key === 'Del') {
    key = 'Backspace';
  }

  document.dispatchEvent(new KeyboardEvent('keyup', { key: key }));
});

function resetGame() {
  currentStreak = 0;
  currentGuess = [];
  nextCharacter = 0;
  successRate = 0;
  rightGuessEquation =
    Object.keys(EQUATION)[
      Math.floor(Math.random() * Object.keys(EQUATION).length)
    ];
  answer = EQUATION[rightGuessEquation];
  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.getElementsByClassName('equation-row')[i];
    for (let j = BOX_LENGTH - 1; j >= 0; j--) {
      let box = row.children[j];
      if (box.textContent !== '') {
        box.classList.remove('filled-box');
        box.removeEventListener('click', deleteCharacter);
        let delay = 250 * (BOX_LENGTH - j);
        setTimeout(() => {
          animateCSS(box, 'flipInX');
          box.style.backgroundColor = '';
          resetKeyBoard(box.textContent, box.style.backgroundColor);
          box.textContent = '';
        }, delay);
      }
    }
  }
  hideAnswer();
  guessesRemaining = NUMBER_OF_GUESSES;
  showAnswer(answer);
  console.log(rightGuessEquation, answer);
}

function resetKeyBoard(character, color) {
  for (const elem of document.getElementsByClassName('keyboard-button')) {
    if (elem.textContent === character) {
      let oldColor = elem.style.backgroundColor;
      if (
        oldColor === 'green' ||
        oldColor === 'yellow' ||
        oldColor === 'grey'
      ) {
        elem.style.backgroundColor = color;
      }
    }
  }
}

function toggleModalInfo() {
  modal.classList.toggle('show-modal');
}

function toggleModalStats() {
  modalStats.classList.toggle('show-modal');
  statsModal.render([totalTries, successRate, currentStreak, bestStreak]);
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModalInfo();
  } else if (event.target === modalStats) {
    toggleModalStats();
  }
}

btnDarkMode.addEventListener('click', () => {
  const element = document.body;
  let footer = document.getElementsByTagName('footer');
  let answerHtml = document.getElementsByClassName('hint');
  element.classList.toggle('dark-mode');
  if (element.classList.contains('dark-mode')) {
    footer[0].style.color = 'white';
    answerHtml[0].style.color = 'white';
  } else {
    footer[0].style.color = 'black';
    answerHtml[0].style.color = 'black';
  }
});

window.addEventListener('click', windowOnClick);
stats.addEventListener('click', toggleModalStats);
info.addEventListener('click', toggleModalInfo);
reset.addEventListener('click', resetGame);
closeStatsButton.addEventListener('click', toggleModalStats);
closeInfoButton.addEventListener('click', toggleModalInfo);

initBoard();
