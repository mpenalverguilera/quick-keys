import {initSettings} from './Settings.js';
import {initGame, initGameEvents, $paragraph} from './Game.js'
import {initResultEvents} from './Result.js'


//Web modifiers
export function setRandomText($element, numberWords, possibleWords, markCurrent) {
    $element.innerHTML = '';
    let words = (possibleWords.length >= numberWords) ? 
    possibleWords.toSorted(() => Math.random() - 0.5).slice(0, numberWords):
    possibleWords.toSorted(() => Math.random() - 0.5);

    $element.innerHTML = words.map((word) => 
            {
                const letters = word.split('')
                return `<my-word>${letters.map((letter) => 
                    `<my-letter>${letter}</my-letter>`)
                    .join('')}</my-word>`
            }).join(' ');
    if (markCurrent) {
        const $firstWord = $element.querySelector('my-word');
        $firstWord.classList.add('current');
        $firstWord.querySelector('my-letter').classList.add('current');
    }
}

//Logic
initGameEvents();
initResultEvents();
initSettings($paragraph);
initGame();