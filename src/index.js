// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import Player from '../src/Player'

let nameInputs = document.querySelector(".player-name-input");
let gameRules = document.querySelector(".game-rules");
let player1Input = document.querySelector(".player1");
let player2Input = document.querySelector(".player2");
let player3Input = document.querySelector(".player3");
let player1Name = document.querySelector(".player1-name");
let player2Name = document.querySelector(".player2-name");
let player3Name = document.querySelector(".player3-name");
let continueBtn = document.querySelector(".continue-button");
let gameBoard = document.querySelector(".game-board");
let playBtn = document.querySelector(".play-button");

nameInputs.addEventListener("keyup", checkInputs);
continueBtn.addEventListener("click", instantiatePlayers);
playBtn.addEventListener("click", showGame);

function checkInputs() {
  if (player1Input.value && player2Input.value && player3Input.value) {
    continueBtn.id = "active";
  }
};

function instantiatePlayers() {
  if (continueBtn.id === "active") {
    let player1 = new Player(player1Input.value);
    let player2 = new Player(player2Input.value);
    let player3 = new Player(player3Input.value);
    showRules();
  } else {
    document.querySelector(".error").style.display = "block";
  }
};

function showRules() {
  let welcomeMsg = `<h3>Welcome ${player1Input.value}, ${player2Input.value}, & ${player3Input.value}!`
  gameRules.insertAdjacentHTML("afterbegin", welcomeMsg);
  nameInputs.style.display = "none";
  gameRules.style.display = "block";
};

function showGame() {
  player1Name.innerText = `${player1Input.value}`;
  player2Name.innerText = `${player2Input.value}`;
  player3Name.innerText = `${player3Input.value}`;
  gameRules.style.display = "none";
  gameBoard.style.display = "grid";
}
