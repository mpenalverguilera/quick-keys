import {timeValues, wordValues, $settings} from './Settings.js';
import {displayResults} from './Result.js'
import {setRandomText} from './general.js';
import {words as INITIAL_WORDS} from './words.js';


//Get HTML elements
const $time = document.querySelector('#game>main>time');
export const $paragraph = document.querySelector('#game>main>p');
const $input = document.querySelector('#game>main>input');
const $game = document.querySelector('#game');


//Game atributes
let currentTime;
let playing = false;
let intervalID
let types = [];

//Game functions
export function initGame() {
    $game.style.display = 'grid';

    actualizeTime(timeValues[0]);
    setRandomText($paragraph, wordValues[0], INITIAL_WORDS, true);
}

export function initGameEvents() {
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

    $currentLetter.classList.add((key === $currentLetter.textContent) ? 'correct' : 'incorrect');
    types.push({time : Date.now(), isCorrect: key === $currentLetter.textContent});
    
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
    displayResults(types);
}

export function actualizeTime(time) {
    currentTime = time;
    $time.textContent = currentTime;
}


