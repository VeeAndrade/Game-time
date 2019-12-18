import $ from 'jquery';
import './css/base.scss';

import './images/underwater.jpg'
import './images/underwater-light.jpg'
import Player from '../src/Player'
import Game from '../src/Game'
import Clue from '../src/Clue'
import '../src/Round'

let nameInputSection = document.querySelector(".player-name-input-section")
let gameRules = document.querySelector(".game-rules");
let player1Input = document.querySelector(".player1");
let player2Input = document.querySelector(".player2");
let player3Input = document.querySelector(".player3");
let player1Name = document.querySelector(".player1-name");
let player2Name = document.querySelector(".player2-name");
let player3Name = document.querySelector(".player3-name");
let player1Score = document.querySelector(".player1-score");
let player2Score = document.querySelector(".player2-score");
let player3Score = document.querySelector(".player3-score");
let continueBtn = document.querySelector(".continue-button");
let gameBoard = document.querySelector(".game-board");
let playBtn = document.querySelector(".play-button");
let player1;
let player2;
let player3;
let clue;
let clueCategories = [];
let clueInfo = [];

function categoryFetch() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/gametime/1903/jeopardy/data')
    .then(data => data.json())
    .then(data => data.data.categories)
    .then(categories => {
      let catKeys = Object.keys(categories)
      catKeys.forEach(key => clueCategories.push({
        [key]: categories[key]
      }))
    })
    .catch(error => console.log('failure'))
}


function clueFetch() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/gametime/1903/jeopardy/data')
    .then(data => data.json())
    .then(data => data.data.clues)
    .then(clues => {
      let clueKeys = Object.keys(clues)
      clueKeys.forEach(key => clueInfo.push(clues[key]))
    })
    .catch(error => console.log('failure'))
}

function getFetches() {
  return Promise.all([clueFetch(), categoryFetch()])
}

function instantiateClues() {
  return clueInfo.map(c => {
    clue = new Clue(c)
  })
}

getFetches()
  .then(() => instantiateClues())

instantiateClues()

nameInputSection.addEventListener("keyup", checkInputs);
continueBtn.addEventListener("click", instantiatePlayers);
playBtn.addEventListener("click", instantiateGame);

function checkInputs() {
  if (player1Input.value && player2Input.value && player3Input.value) {
    continueBtn.id = "active";
  }
};

function instantiatePlayers() {
  if (continueBtn.id === "active") {
    player1 = new Player(player1Input.value);
    player2 = new Player(player2Input.value);
    player3 = new Player(player3Input.value);
    showRules();
  } else {
    document.querySelector(".error").style.visibility = "visible";
  }
};

function showRules() {
  let welcomeMsg = `<h3>Welcome ${player1Input.value}, ${player2Input.value}, & ${player3Input.value}!`
  gameRules.insertAdjacentHTML("afterbegin", welcomeMsg);
  nameInputSection.style.display = "none";
  gameRules.style.display = "block";
};

function instantiateGame() {
  let game = new Game([player1, player2, player3]);
  showGame();
}

function showGame() {
  player1Name.innerText = `${player1Input.value}`;
  player2Name.innerText = `${player2Input.value}`;
  player3Name.innerText = `${player3Input.value}`;
  gameRules.style.display = "none";
  gameBoard.style.display = "grid";
  updatePlayerScore();
}

function updatePlayerScore() {
    player1Score.innerText = `${player1.score}`
    player2Score.innerText = `${player2.score}`
    player3Score.innerText = `${player3.score}`
}
