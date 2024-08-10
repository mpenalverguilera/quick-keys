import {words as INITIAL_WORDS} from './words.js';
import {timeValues, wordValues, initSettings} from './Settings.js';

//Get HTML elements
const $time = document.querySelector('#game>main>time');
const $paragraph = document.querySelector('#game>main>p');
const $input = document.querySelector('#game>main>input');
const $game = document.querySelector('#game');
const $result = document.querySelector('#result');
const $resetButton = document.querySelector('#result>button')
const $wmp = $result.querySelector('#wpm>span');
const $accuracy = $result.querySelector('#accuracy>span');
const $settings = document.querySelector('#settings');

//Game atributes
let words = [];
let initial_time;
let currentTime;
let playing = false;
let intervalID

//Game functions
function initGame() {
    $game.style.display = 'grid';
    $result.style.display = 'none';

    actualizeTime(timeValues[0]);
    setRandomText($paragraph, wordValues[0], INITIAL_WORDS, true);
}

function initGameEvents() {
     document.addEventListener('keydown', () => {
        $input.focus();
        if(!playing) {
            playing = true;
            $settings.style.pointerEvents = 'none';
            $settings.style.opacity = '0.6';
            intervalID = setInterval(() => {
                currentTime--;
                $time.textContent = currentTime;
                if(currentTime <= 0) {
                    playing = false;
                    $settings.style.pointerEvents = '';
                    $settings.style.opacity = '1';
                    clearInterval(intervalID);
                    gameOver();
                }
            }, 1000);
        }
    })

    $input.addEventListener('keydown', handleKeyDown);
    $input.addEventListener('keyup', handleKeyUp);
    $resetButton.addEventListener('click', initGame);
}

function handleKeyDown(event) {
    event.preventDefault();
    const { key } = event;

    if(key !== 'Backspace') return;
    
    const $currentWord = $paragraph.querySelector('my-word.current');
    const $currentLetter = $currentWord.querySelector('my-letter.current');

    if($currentLetter.classList.contains('is-last')) {
        $currentLetter.classList.remove('is-last','correct', 'incorrect');
        $currentWord.classList.remove('marked')
        return;
    }

    if($currentLetter.previousElementSibling) {
        $currentLetter.classList.remove('current');
        $currentLetter.previousElementSibling.classList.add('current');
        $currentLetter.previousElementSibling.classList.remove('correct', 'incorrect');
        return;
    }

    if($currentWord.previousElementSibling) {
        $currentWord.previousElementSibling.classList.add('current');
        $currentWord.previousElementSibling.querySelector('my-letter:last-child').classList.add('current', 'is-last');

        $currentLetter.classList.remove('current');
        $currentWord.classList.remove('current');
    }


}

function handleKeyUp(event) {
    event.preventDefault();
    const { key } = event;
   
    if (key === 'Backspace') return;

    const $currentWord = $paragraph.querySelector('my-word.current');
    const $currentLetter = $currentWord.querySelector('my-letter.current');

    if(key === ' ' && $currentLetter.classList.contains('is-last')) {
        $currentLetter.classList.remove('current', 'is-last');
        $currentWord.classList.remove('current');

        const nextWord = $currentWord.nextElementSibling;
        nextWord.classList.add('current');
        nextWord.querySelector('my-letter').classList.add('current');
        
        return
    }

    if ($currentLetter.classList.contains('is-last')) return;

    (key === $currentLetter.textContent) ? 
        $currentLetter.classList.add('correct') : 
        $currentLetter.classList.add('incorrect');
    
    if($currentLetter.nextSibling) {
        $currentLetter.classList.remove('current');
        $currentLetter.nextSibling.classList.add('current');
        return
    }

    $currentLetter.classList.add('is-last');
    const hasMissedLetters = $currentWord
    .querySelectorAll('my-letter:not(.correct)').length > 0

    const classToAdd = hasMissedLetters ? 'marked' : 'correct'
    $currentWord.classList.add(classToAdd)

    if (!$currentWord.nextSibling) {
        gameOver();
    }
}

function gameOver() {
    playing = false;
    clearInterval(intervalID)
    
    $game.style.display = 'none';
    $result.style.display = 'flex';

    let correct = $game.querySelectorAll('my-word.correct').length
    let total = $game.querySelectorAll('my-word.correct').length + $game.querySelectorAll('my-word.marked').length
    $accuracy.textContent = `${(total) ? ((correct/total)*100).toFixed(2) : 0}%`;
    $wmp.textContent = $game.querySelectorAll('my-word.correct').length*(60/initial_time);
}


//Web modifiers
function setRandomText($element, numberWords, possibleWords, current) {
    $element.innerHTML = '';
    words = (possibleWords.length >= numberWords) ? 
    possibleWords.toSorted(() => Math.random() - 0.5).slice(0, numberWords):
    possibleWords.toSorted(() => Math.random() - 0.5);

    $element.innerHTML = words.map((word) => 
            {
                const letters = word.split('')
                return `<my-word>${letters.map((letter) => 
                    `<my-letter>${letter}</my-letter>`)
                    .join('')}</my-word>`
            }).join(' ');
    if (current) {
        const $firstWord = $element.querySelector('my-word');
        $firstWord.classList.add('current');
        $firstWord.querySelector('my-letter').classList.add('current');
    }
}

function actualizeTime(time) {
    initial_time = currentTime = time;
    $time.textContent = currentTime;
}

//Logic
initGameEvents();
initSettings();
initGame();