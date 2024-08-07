import {words as INITIAL_WORDS} from './words.js';

const $time = document.querySelector('#game>time');
const $paragraph = document.querySelector('#game>p');
const $input = document.querySelector('#game>input');
const $game = document.querySelector('#game');
const $result = document.querySelector('#result');
const $resetButton = document.querySelector('#result>button')

const INITIAL_TIME = 10;
const TEXT_LENGTH = 20;

let words = [];
let currentTime = INITIAL_TIME;
let playing = false;
let intervalID

initEvents();
initGame();

function initGame() {
    currentTime = INITIAL_TIME;
    $time.textContent = currentTime;
    $game.style.display = 'grid';
    $result.style.display = 'none';

    words = INITIAL_WORDS.toSorted(() => Math.random() - 0.5).slice(0, TEXT_LENGTH);
    $paragraph.innerHTML = words.map((word, index) => 
        {
            const letters = word.split('')
            return `<my-word>${letters.map((letter, index) => 
                `<my-letter>${letter}</my-letter>`)
                .join('')}</my-word>`
        }
    ).join(' ');

    const $firstWord = $paragraph.querySelector('my-word');
    $firstWord.classList.add('current');
    $firstWord.querySelector('my-letter').classList.add('current');
}

function initEvents() {
     document.addEventListener('keydown', () => {
        $input.focus();
        if(!playing) {
            playing = true;
            intervalID = setInterval(() => {
                currentTime--;
                $time.textContent = currentTime;
                if(currentTime <= 0) {
                    playing = false;
                    clearInterval(intervalID);
                    gameOver();
                }
            }, 1000);
        }
    })

    $input.addEventListener('keydown', handleKeyDown);
    $input.addEventListener('keyup', handleKeyUp);
    $resetButton.addEventListener('click', initGame)
}

function handleKeyDown(event) {
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

    const $wmp = $result.querySelector('#wpm>span');
    const $accuracy = $result.querySelector('#accuracy>span');

    $wmp.textContent = $game.querySelectorAll('my-word.correct').length*(60/INITIAL_TIME);
    let correct = $game.querySelectorAll('my-word.correct').length
    let total = $game.querySelectorAll('my-word.correct').length + $game.querySelectorAll('my-word.marked').length
    $accuracy.textContent = `${(total) ? ((correct/total)*100).toFixed(2) : 0}%`;
}
