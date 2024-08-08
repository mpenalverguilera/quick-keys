import {words as INITIAL_WORDS} from './words.js';

//Get HTML elements
const $time = document.querySelector('#game>main>time');
const $paragraph = document.querySelector('#game>main>p');
const $input = document.querySelector('#game>main>input');
const $game = document.querySelector('#game');
const $result = document.querySelector('#result');
const $resetButton = document.querySelector('#result>button')
const $wmp = $result.querySelector('#wpm>span');
const $accuracy = $result.querySelector('#accuracy>span');
const $options = document.querySelector('#options');
const $settings = document.querySelector('#settings');
const $settingsValues = $settings.querySelector('div[name="values"]');
const $timeSettings = $options.querySelector('button[name="time"]');
const $wordsSettings = $options.querySelector('button[name="words"]');

//Game Modifiers
const INITIAL_TIME = 30;
const TEXT_LENGTH = 20;

//Game atributes
let words = [];
let currentTime = INITIAL_TIME;
let playing = false;
let intervalID

//Setting attributes
let timeValues = [
    {value: 15, style: null},
    {value: 30, style: 'active'},
    {value: 50, style: null},
    {value: 'custom', style: null, custom: null}
];

let wordValues = [
    {value: 20, style: 'active'},
    {value: 30, style: null},
    {value: 50, style: null},
    {value: 'custom', style: null, custom: null}
];

//Game functions
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
    $timeSettings.addEventListener('click', () => {
        toggleSettings($timeSettings);
        setValues(timeValues)
    });
    $wordsSettings.addEventListener('click', () => {
        toggleSettings($wordsSettings);
        setValues(wordValues)
    });
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
    $wmp.textContent = $game.querySelectorAll('my-word.correct').length*(60/INITIAL_TIME);
}

//Settings handler
function setValues(array) {
    $settingsValues.innerHTML = '';
    array.forEach((value, index) => {
        let $elem = document.createElement('button');
        if (value.value === 'custom') {
            $elem.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i>';
        }
        else $elem.textContent = value.value;
        if (value.style !== null) $elem.classList.add(value.style);
        $elem.addEventListener('click', () => setOptionActive($elem, array, index));

        $settingsValues.appendChild($elem);
    });
}

function setOptionActive($toActivate, array, index) {
    $toActivate.parentElement.querySelector('button.active').classList.remove('active');
    $toActivate.classList.add('active');
    array.forEach((value, i) => (i === index) ? value.style = 'active': value.style = null);
}

function initSettings() {
    $options.querySelector('button[name="time"]').classList.add('active');
    setValues(timeValues);
}

function toggleSettings($setting) {
    $setting.parentElement.querySelector('.active').classList.remove('active');
    $setting.classList.add('active');
}

//Logic
initEvents();
initSettings();
initGame();