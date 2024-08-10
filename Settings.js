import {words as INITIAL_WORDS} from './words.js';
import {setRandomText, actualizeTime} from './general.js'


const $options = document.querySelector('#options');
export const $settings = document.querySelector('#settings');
const $settingsValues = $settings.querySelector('div[name="values"]');
const $timeSettings = $options.querySelector('button[name="time"]');
const $wordsSettings = $options.querySelector('button[name="words"]');

//Setting attributes
export let timeValues = [15, 30, 60, 100];
export let wordValues = [20, 30, 50, 100];


//Settings handlers
export function initSettings($modifier) {
    $options.querySelector('button[name="time"]').classList.add('active');
    //Add option handlers
    $timeSettings.addEventListener('click', () => setOptionActive($timeSettings));
    $wordsSettings.addEventListener('click', () => setOptionActive($wordsSettings));
    $settingsValues.appendChild(createWordSelector(wordValues, $modifier));
    $settingsValues.appendChild(createTimeSelector(timeValues));

}

function createWordSelector(values, $modifier) {
    const $wordSelector = document.createElement('div');
    $wordSelector.setAttribute('name', 'words');
    values.forEach((value, index) => {
        const $elem = document.createElement('button');
        
        if (index === values.length - 1) {
            $elem.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i>';
            $elem.addEventListener('click', () => {
                setValueActive($elem);
                value = changeCustomValue(values);
                setRandomText($modifier, value, INITIAL_WORDS, true);
            });            
        }
        else {
            $elem.textContent = value;
            if (index === 0) $elem.classList.add('active');
            $elem.addEventListener('click', () => {
                setValueActive($elem);
                setRandomText($modifier, value, INITIAL_WORDS, true);
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
