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
let clueCards = document.querySelector(".clue-cards");
let winnerScreen = document.querySelector(".winner-screen");
let leaderButton = document.querySelector(".leaderboard-button");
let dropdownMenuSection = document.querySelector(".dropdown-menu");
let restartButton = document.querySelector(".restart-button");
let main = document.querySelector("main");
let players = [];
let clue;
let game;
let clueCount = 0;
let clueCategories = [];
let usedCategories = [];
let clueInfo = [];
let clueId = 1;
let selectedClue;
let submitGuessBtn = document.querySelector(".submit-guess");
let submitWagerBtn = document.querySelector(".submit-wager");
let submitFinalBtn = document.querySelector(".submit-final");


nameInputSection.addEventListener("keyup", checkInputs);
continueBtn.addEventListener("click", instantiatePlayers);
playBtn.addEventListener("click", instantiateGame);
clueCards.addEventListener("click", displaySelectedClue);
submitGuessBtn.addEventListener("click", evaluateGuess);
leaderButton.addEventListener('click', dropdownMenu);
restartButton.addEventListener("click", restartGame);
submitWagerBtn.addEventListener("click", collectWagers)
submitFinalBtn.addEventListener("click", evaluateFinalGuess)


function categoryFetch() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/gametime/1903/jeopardy/data')
    .then(data => data.json())
    .then(data => data.data.categories)
    .then(categories => {
      let catKeys = Object.keys(categories)
      catKeys.forEach(key => clueCategories.push({
        category: key, id: categories[key]
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

getFetches()
  .then(() => instantiateClues())

function instantiateClues() {
  return clueInfo.map(c => {
    c.id = clueId;
    clue = new Clue(c);
    clueId++;
  })
}

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
    players.push(player1, player2, player3);
    showRules();
  } else {
    document.querySelector(".error").style.visibility = "visible";
  }
};

function showRules() {
  nameInputSection.style.display = "none";
  gameRules.style.display = "block";
};

function instantiateGame() {
  game = new Game(players);
  game.updateRound();
  pickCategories();
  players[0].takeTurn();
  $('.player1-sidebar').css("background-color", "#88A5E9");
  showGame();
}

function pickCategories() {
  shuffleArray(clueCategories);
  let currentIndex = 0;
  let currentCategories = [];
  while (currentCategories.length !== 4) {
    if (!usedCategories.includes(clueCategories[`${currentIndex}`])) {
      $(`.category${currentIndex + 1}`).text(`${clueCategories[`${currentIndex}`].category.split(/(?=[A-Z])/).join(" ").toUpperCase()}`);
      currentCategories.push(clueCategories[`${currentIndex}`]);
      usedCategories.push(clueCategories[`${currentIndex}`]);
    }
    currentIndex++;
  }
  findCategoryClues(currentCategories);
}

function findFinalCategory() {
  let finalCategory = clueCategories.find(category => !usedCategories.includes(category));
  let allCategoryClues = clueInfo.filter(clue => clue.categoryId === finalCategory.id);
  shuffleArray(allCategoryClues);
  let finalClue = allCategoryClues[0];
  displayFinal(finalClue, finalCategory);
}

function shuffleArray(arr) {
	let currentIndex = arr.length;
	let temporaryValue;
  let randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = arr[currentIndex];
		arr[currentIndex] = arr[randomIndex];
		arr[randomIndex] = temporaryValue;
	}
};

function findCategoryClues(categories) {
  categories.forEach(category => {
    let categoryClues = clueInfo.filter(clue => clue.categoryId === category.id)
    shuffleArray(categoryClues);
    let currentClues = [];
    let pointLevel = 1;
    while (pointLevel !== 5) {
      let clue = categoryClues.find(clue => clue.pointValue == `${pointLevel}00`)
      currentClues.push(clue);
      pointLevel++;
    }
    addCluesToDom(currentClues)
  })
}

function addCluesToDom(clues) {
  let pointLevel = 1;
  while (pointLevel !== 5) {
    clues.forEach(clue => {
      if (clue.pointValue == `${pointLevel}00` && game.roundCount === 1) {
        $( ".clue-cards" ).append(`<div class="clue-card clue-points value${pointLevel}00" id="${clue.id}">${pointLevel}00</div>`);
      } else if (clue.pointValue == `${pointLevel}00` && game.roundCount === 2) {
        $( ".clue-cards" ).append(`<div class="clue-card clue-points value${pointLevel}00" id="${clue.id}">${pointLevel * 2}00</div>`);
      }
    })
    pointLevel++;
  }
}

function showGame() {
  player1Name.innerText = `${player1Input.value}`;
  player2Name.innerText = `${player2Input.value}`;
  player3Name.innerText = `${player3Input.value}`;
  gameRules.style.display = "none";
  gameBoard.style.display = "grid";
  $('.selected-clue-info').css("display", "grid");
  $('.game-categories').css("display", "flex");
  updatePlayerScore();
}

function updatePlayerScore() {
  player1Score.innerText = `${players[0].score}`
  player2Score.innerText = `${players[1].score}`
  player3Score.innerText = `${players[2].score}`
}

function displaySelectedClue(event) {
  let clickedCard = event.target.closest(".clue-card");
  selectedClue = clueInfo.find(clue => clue.id == clickedCard.id)
  let selectedCategory = clueCategories.find(category => category.id === selectedClue.categoryId)
  let selectedPoints = selectedClue.pointValue * game.roundCount;
  $('.selected-clue-category').text(`${selectedCategory.category.split(/(?=[A-Z])/).join(" ").toUpperCase()}`);
  $('.selected-clue-points').text(`${selectedPoints}`);
  $('.question').text(`${selectedClue.question}`);
}

function displayFinal(clue, category) {
  selectedClue = clue;
  $('.final-round-wagers').css("display", "block");
  $('.final-clue-category').text(`${category.category.split(/(?=[A-Z])/).join(" ").toUpperCase()}`);
  $('.final-clue-question').text(`${clue.question}`);
}

function dropdownMenu() {
    dropdownMenuSection.classList.toggle('hide');
    main.classList.toggle('no-clicks')
}

function restartGame() {
  nameInputSection.style.display = "block";
  gameRules.style.display = "none";
  gameBoard.style.display = "none";
  winnerScreen.style.display = "none";
  clueCards.innerHTML = "";
  resetValues();
}

function resetValues() {
  players = [];
  clueCount = 0;
  $('.player1').val("");
  $('.player2').val("");
  $('.player3').val("");
  $('.player1Wager').val("");
  $('.player2Wager').val("");
  $('.player3Wager').val("");
  $('.player1Final').val("");
  $('.player2Final').val("");
  $('.player3Final').val("");
  resetClue();
}

function evaluateGuess() {
  if ($(".player-guess").val() && $(`#${selectedClue.id}`).css("visibility") === "visible") {
    let response;
    let points = selectedClue.pointValue * game.roundCount
    $('.answer-response').css("display", "flex");
    if ($(".player-guess").val().toUpperCase() === selectedClue.answer.toUpperCase()) {
      $(".response").text(`Correct! \n You get ${points} points!`);
      response = "correct";
    } else {
      $(".response").text(`Incorrect! \n The answer is ${selectedClue.answer}. \n You lose ${points} points!`)
      response = "incorrect";
    }
  calculateScore(response);
  }
  $(".player-guess").val('');
}

function collectWagers() {
  $('.final-round-wagers').css("display", "none");
  $('.final-round-question').css("display", "block");
  players[0].wager = $('.player1Wager').val();
  players[1].wager = $('.player2Wager').val();
  players[2].wager = $('.player3Wager').val();
}

function evaluateFinalGuess() {
  players[0].finalGuess = $('.player1Final').val().toUpperCase();
  players[1].finalGuess = $('.player2Final').val().toUpperCase();
  players[2].finalGuess = $('.player3Final').val().toUpperCase();
  players.forEach(player => {
    if (player.finalGuess === selectedClue.answer.toUpperCase()) {
      player.increaseScore(player.wager);
    } else {
      player.decreaseScore(player.wager);
    }
  })
  determineWinner();
}

function determineWinner() {
  players.sort((a,b) => b.score - a.score);
  let winner = players[0];
  displayWinner(winner);
}

function displayWinner(winner) {
  $('.final-round-question').css("display", "none");
  $('.game-board').css("display", "none");
  $('.winner-screen').css("display", "block");
  $('.winner').text(`${winner.name}`);
}

function calculateScore(response) {
  let currentPlayer = players.find(player => player.turn);
  if (response === 'correct') {
    currentPlayer.score += (selectedClue.pointValue * game.roundCount);
  } else {
    currentPlayer.score -= (selectedClue.pointValue * game.roundCount);
  }
  updatePlayerScore();
  updateGameDisplay(currentPlayer);
}

function updateClueCount() {
  resetClue();
  clueCount++;
  if (clueCount === 16) {
    game.updateRound();
    startRound2();
  };
  if (clueCount === 32) {
    game.updateRound();
    startFinalRound()
  };
}

function resetClue() {
  $('.selected-clue-category').text('');
  $('.selected-clue-points').text('');
  $('.question').text('');
}

function updateGameDisplay(player) {
  $(`#${selectedClue.id}`).css("visibility", "hidden");
  $('.game-board').css("pointer-events", "none")
  setTimeout(function() { $('.answer-response').css("display", "none")}, 1500);
  setTimeout(function() { $('.game-board').css("pointer-events", "auto")}, 1500);
  setTimeout(function() { updateClueCount(); }, 2000);
  setTimeout(function () { switchPlayer(player); }, 1500);
}

function switchPlayer(player) {
  player.takeTurn();
  let i = players.indexOf(player);
  $(`.player${i + 1}-sidebar`).css("background-color", "transparent");
  if (players[players.indexOf(player) + 1]) {
    players[players.indexOf(player) + 1].takeTurn();
    $(`.player${i + 2}-sidebar`).css("background-color", "#88A5E9");
  } else {
    players[0].takeTurn();
    $('.player1-sidebar').css("background-color", "#88A5E9");
  }
}

function startRound2() {
  $('.clue-cards').html("");
  $('.selected-clue-category').text('');
  $('.selected-clue-points').text('');
  $('.question').text('');
  pickCategories(2);
}

function startFinalRound() {
  $('.clue-cards').html("");
  $('.selected-clue-info').css("display", "none");
  $('.game-categories').css("display", "none");
  findFinalCategory();
}
