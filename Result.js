import { initGame } from './Game.js';

//Get HTML elements
const $result = document.querySelector('#result');
const $resetButton = document.querySelector('#result>button')
const $wmp = $result.querySelector('#wpm>span');
const $accuracy = $result.querySelector('#accuracy>span');

export function displayResults(keys) {
    $result.style.display = 'flex';
    const totalKeys = keys.length;
    const correctKeys = keys.filter(value => value.isCorrect).length;
    const accuracy = (correctKeys / totalKeys) * 100;

    const startTime = keys[0].time;
    const endTime = keys[totalKeys - 1].time;
    const totalTime = (endTime - startTime) / 1000; // convert to seconds
    const wordsPerMinute = Math.round((totalKeys / 5) / (totalTime / 60));

    $wmp.textContent = wordsPerMinute;
    $accuracy.textContent = `${accuracy.toFixed(2)}%`;
}

export function initResultEvents() {
    $result.style.display = 'none';
    $resetButton.addEventListener('click', () => {
        $result.style.display = 'none';
        initGame()
    });
}