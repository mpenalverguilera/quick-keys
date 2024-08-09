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

//Setting attributes
let timeValues = [15, 30, 60, 100];
let wordValues = [20, 30, 50, 100];


//Settings handlers
function initSettings() {
    $options.querySelector('button[name="time"]').classList.add('active');
    //Add option handlers
    $timeSettings.addEventListener('click', () => setOptionActive($timeSettings));
    $wordsSettings.addEventListener('click', () => setOptionActive($wordsSettings));
    $settingsValues.appendChild(createWordSelector(wordValues));
    $settingsValues.appendChild(createTimeSelector(timeValues));

}

function createWordSelector(values) {
    const $wordSelector = document.createElement('div');
    $wordSelector.setAttribute('name', 'words');
    values.forEach((value, index) => {
        const $elem = document.createElement('button');
        
        if (index === values.length - 1) {
            $elem.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i>';
            $elem.addEventListener('click', () => {
                setValueActive($elem);
                value = changeCustomValue(values);
                setRandomText($paragraph, value, INITIAL_WORDS, true);
            });            
        }
        else {
            $elem.textContent = value;
            if (index === 0) $elem.classList.add('active');
            $elem.addEventListener('click', () => {
                setValueActive($elem);
                setRandomText($paragraph, value, INITIAL_WORDS, true);
            });            
        }
        $wordSelector.appendChild($elem);
    });
    $wordSelector.style.display = 'none';
    return $wordSelector;
}

function createTimeSelector(values) {
    const $timeSelector = document.createElement('div');
    $timeSelector.setAttribute('name', 'time');
    values.forEach((value, index) => {
        const $elem = document.createElement('button');
        
        if (index === values.length - 1) {
            $elem.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i>';
            $elem.addEventListener('click', () => {
                setValueActive($elem);
                value = changeCustomValue(values);
                actualizeTime(value);
            });            
        }
        else {
            $elem.textContent = value;
            if (index === 0) $elem.classList.add('active');
            $elem.addEventListener('click', () => {
                setValueActive($elem);
                actualizeTime(value);
            });            
        }
        $timeSelector.appendChild($elem);
    });
    return $timeSelector;
}

function changeCustomValue(array) {
    const newValue = prompt('Enter a new value');
    if (newValue === null) return 0;
    array[array.length - 1] = newValue;
    return newValue;
}

function setOptionActive($toActivate) {
    setValueActive($toActivate);
    $settingsValues.querySelectorAll('div').forEach((div) => div.style.display = 'none');
    $settingsValues.querySelector(`div[name="${$toActivate.getAttribute('name')}"]`).style.display = '';
}

function setValueActive($toActivate) {
    const $active = $toActivate.parentElement.querySelector('button.active')
    if ($active !== null) $active.classList.remove('active');
    $toActivate.classList.add('active');
}

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