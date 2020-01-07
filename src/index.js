import $ from 'jquery';
import './css/base.scss';

import './images/underwater.jpg'
import './images/underwater-light.jpg'
import './images/fish.png'
import './images/starfish.png'
import './images/shark.png'
import Player from '../src/Player'
import Game from '../src/Game'
import Clue from '../src/Clue'
import DailyDouble from '../src/Daily-Double'
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
let clickedCard;
let response;
let game;
let allClues = [];
let currentClues;
let randomNumber1;
let randomNumber2;
let randomNumber3;
let clueCount = 0;
let turns = 0;
let clueCategories = [];
let usedCategories = [];
let clueInfo = [];
let clueId = 1;
let selectedClue;
let submitGuessBtn = document.querySelector(".submit-guess");
let submitWagerBtn = document.querySelector(".submit-wager");
let submitFinalBtn = document.querySelector(".submit-final");
let totalClues;
let wagerAmount;
let playersWager;
let ddWagerBtn = document.querySelector('.submit-DD-wager');
let ddSubmitBtn = document.querySelector('.daily-double-guess-btn');

nameInputSection.addEventListener("keyup", checkInputs);
continueBtn.addEventListener("click", instantiatePlayers);
playBtn.addEventListener("click", instantiateGame);
clueCards.addEventListener("click", displaySelectedClue);
submitGuessBtn.addEventListener("click", evaluateGuess);
leaderButton.addEventListener('click', dropdownMenu);
restartButton.addEventListener("click", restartGame);
submitWagerBtn.addEventListener("click", collectWagers)
submitFinalBtn.addEventListener("click", evaluateFinalGuess)
ddWagerBtn.addEventListener('click', checkDDWager)
ddSubmitBtn.addEventListener('click', evaluateDailyDoubleGuess)

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
    .catch(error => console.log(error))
}

function clueFetch() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/gametime/1903/jeopardy/data')
    .then(data => data.json())
    .then(data => data.data.clues)
    .then(clues => {
      let clueKeys = Object.keys(clues)
      clueKeys.forEach(key => clueInfo.push(clues[key]))
    })
    .catch(error => console.log(error))
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
  oneRandomInt(1, 16)
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
    currentClues = [];
    let pointLevel = 1;
    while (pointLevel !== 5) {
      let clue = categoryClues.find(clue => clue.pointValue == `${pointLevel}00`)
      currentClues.push(clue);
      pointLevel++;
    }
    allClues.push(currentClues)
    addCluesToDom(currentClues)
  })
  totalClues = allClues.reduce((acc, val) => acc.concat(val), [])
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
  let currentPlayer = players.find(player => player.turn);
  clickedCard = event.target.closest(".clue-card");
  if (!clickedCard) {
    return;
  }
  selectedClue = clueInfo.find(clue => clue.id == clickedCard.id)
  clueCards.classList.add('no-clicks');
  turns ++;
  if (turns === randomNumber1 || turns === randomNumber2 || turns === randomNumber3) {
    makeDailyDouble(currentPlayer);
  } else {
  let selectedCategory = clueCategories.find(category => category.id === selectedClue.categoryId)
  let selectedPoints = selectedClue.pointValue * game.roundCount;
  $('.selected-clue-category').text(`${selectedCategory.category.split(/(?=[A-Z])/).join(" ").toUpperCase()}`);
  $('.selected-clue-points').text(`${selectedPoints}`);
  $('.question').text(`${selectedClue.question}`);
  }
}

function removeCardFromTotal(card) {
  let cardToRemove = totalClues.find(clue => clue.id == card.id)
  let indexOfCard = totalClues.indexOf(cardToRemove)
  totalClues.splice(indexOfCard, 1)
}

function makeDailyDouble(player) {
  let dailyDouble = new DailyDouble(selectedClue)
  let highestPointClue = sortClues();
  wagerAmount = dailyDouble.determineWager(turns, player, highestPointClue);
  console.log(dailyDouble)
  console.log(turns)
  console.log(highestPointClue)
  console.log(wagerAmount)
  displayDailyDouble(dailyDouble, wagerAmount);
}

function sortClues() {
  let sortedClues = totalClues.sort((a, b) => {
    return b.pointValue - a.pointValue;
  });
  return sortedClues[0].pointValue;
}

function displayDailyDouble(clue, wager) {
  let selectedCategory = clueCategories.find(category => category.id === clue.categoryId)
  $('.daily-double-wager').css("display", "flex");
  $('.daily-double-category').text(`${selectedCategory.category.split(/(?=[A-Z])/).join(" ").toUpperCase()}`);
  $('.daily-double-question').text(`${clue.question}`);
  $('.daily-double-wager-amount').text(`Set your wager between 5 and ${wager} points.`)
  $('.clue-cards').css("display", "none");
  $('.selected-clue-info').css("display", "none");
  $('.game-categories').css("display", "none");
}

function evaluateDailyDoubleGuess() {
  if ($('.daily-double-input').val() === '') {
    return $('.guess-error').text("Please enter your guess below")
  } if ($('.daily-double-input').val().toUpperCase() === clue.answer.toUpperCase()) {
    $('.answer-response').css("display", "flex");
    $(".response").text(`Correct! \n You get ${playersWager} points!`);
    response = "correct";
  } else {
    $('.answer-response').css("display", "flex");
    $(".response").text(`Incorrect! \n The answer is ${clue.answer}. \n You lose ${playersWager} points!`)
    response = "incorrect";
  }
  calculateDDScore(response);
  $('.clue-cards').css("display", "grid");
  $('.selected-clue-info').css("display", "grid");
  $('.game-categories').css("display", "flex");
  $('.daily-double-input').val('');
  $('.daily-double-wager-input').val('');
  $('.daily-double-wager').css("display", "none");
  $('.daily-double-question-div').css("display", "none");
}

function oneRandomInt(min, max) {
  randomNumber1 = 16;
  // randomNumber1 = Math.floor(Math.random() * (max - min) + min);
}

function twoRandomInts(min, max) {
  randomNumber2 = Math.floor(Math.random() * (max - min) + min);
  randomNumber3 = Math.floor(Math.random() * (max - min) + min);
  if (randomNumber2 === randomNumber3) {
    twoRandomInts(17, 32)
  } else {
    return;
  }
}

function displayFinal(clue, category) {
  selectedClue = clue;
  $('.final-round-wagers').css("display", "flex");
  $('.player1-label').text(players[0].name);
  $('.player2-label').text(players[1].name);
  $('.player3-label').text(players[2].name);
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
  turns = 0;
  clueCount = 0;
  $('.player1').val("");
  $('.player2').val("");
  $('.player3').val("");
  $('.player1-wager').val("");
  $('.player2-wager').val("");
  $('.player3-wager').val("");
  $('.player1-final').val("");
  $('.player2-final').val("");
  $('.player3-final').val("");
  resetClue();
}

function evaluateGuess() {
  if ($(".player-guess").val() && $(`#${selectedClue.id}`).css("visibility") === "visible") {
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
  $('.final-round-question').css("display", "flex");
  players[0].wager = $('.player1-wager').val();
  players[1].wager = $('.player2-wager').val();
  players[2].wager = $('.player3-wager').val();
}

function evaluateFinalGuess() {
  players[0].finalGuess = $('.player1-final').val().toUpperCase();
  players[1].finalGuess = $('.player2-final').val().toUpperCase();
  players[2].finalGuess = $('.player3-final').val().toUpperCase();
  players.forEach(player => {
    if (player.finalGuess === selectedClue.answer.toUpperCase()) {
      player.increaseScore(player.wager);
    } else {
      player.decreaseScore(player.wager);
    }
  })
  determineWinner();
}

function checkDDWager() {
  if ($('.daily-double-wager-input').val() > wagerAmount || $('.daily-double-wager-input').val() < 5) {
    $('.daily-double-wager-input').val('')
    $('.daily-double-wager-input').css('border', 'solid red 2px')
    $('.error-message').text('Enter an amount between the specified range.')
  } else {
    playersWager = $('.daily-double-wager-input').val();
    displayDailyDoubleQuestion();
  }
}

function displayDailyDoubleQuestion() {
  $('.daily-double-wager').css('display', 'none')
  $('.daily-double-question-div').css('display', 'block')
}

function determineWinner() {
  players.sort((a,b) => b.score - a.score);
  let winner = players[0];
  showFinalAnswer(winner);
}

function showFinalAnswer(winner) {
  $('.final-round-question').css("display", "none");
  $('.final-answer').css("display", "flex");
  $('.final-round-answer').text(`The correct answer was ${selectedClue.answer}!`);
  setTimeout(function() { displayWinner(winner); }, 2500);
}

function displayWinner(winner) {
  $('.final-answer').css("display", "none");
  $('.game-board').css("display", "none");
  $('.winner-screen').css("display", "block");
  $('.winner').text(winner.name);
  $('.first-place-score').text(`${winner.score} Points`);
  $('.second-place-score').text(`${players[1].score} Points`);
  $('.second-place-name').text(players[1].name);
  $('.third-place-score').text(`${players[2].score} Points`);
  $('.third-place-name').text(players[2].name);
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

function calculateDDScore(response) {
  let currentPlayer = players.find(player => player.turn);
  if (response === 'correct') {
    currentPlayer.score += (playersWager);
  } else {
    currentPlayer.score -= (playersWager);
  }
  updatePlayerScore();
  updateGameDisplay(currentPlayer);
  $('.daily-double-wager').css("display", "none");
  $('.daily-double-category').text('');
  $('.daily-double-question').text('');
  $('.daily-double-wager-amount').text('')
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
  setTimeout(function () { clueCards.classList.remove('no-clicks'); }, 2000);
}

function switchPlayer(player) {
  removeCardFromTotal(clickedCard)
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
  twoRandomInts(17, 32)
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
