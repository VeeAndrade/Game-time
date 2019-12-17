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
let player1Name = document.querySelector(".player1");
let player2Name = document.querySelector(".player2");
let player3Name = document.querySelector(".player3");
let continueBtn = document.querySelector(".continue-button");

nameInputs.addEventListener("keyup", checkInputs);
continueBtn.addEventListener("click", showDirections);

function checkInputs() {
  if (player1Name.value && player2Name.value && player3Name.value) {
    continueBtn.id = "active";
  }
};

function showDirections() {
  if (continueBtn.id === "active") {
    let player1 = new Player(player1Name.value);
    let player2 = new Player(player2Name.value);
    let player3 = new Player(player3Name.value);
    nameInputs.style.display = "none";
    gameRules.style.display = "block";
    let welcomeMsg = `<h3>Welcome ${player1Name.value}, ${player2Name.value}, & ${player3Name.value}!`
    gameRules.insertAdjacentHTML("afterbegin",
    welcomeMsg);
  } else {
    document.querySelector(".error").style.display = "block";
  }
};
