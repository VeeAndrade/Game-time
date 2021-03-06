
/* eslint-disable max-len */
/* eslint-disable brace-style */

import $ from "jquery";
import "./css/base.scss";

import "./images/underwater.jpg"
import "./images/underwater-light.jpg"
import "./images/fish.png"
import "./images/starfish.png"
import "./images/shark.png"
import Player from "../src/Player"
import Game from "../src/Game"
import Clue from "../src/Clue"
import DailyDouble from "../src/Daily-Double"

let allClues = [];
let clickedCard;
let clue;
let $clueCards = $(".clue-cards");
let clueCategories = [];
let clueCount = 0;
let clueId = 1;
let clueInfo = [];
let $continueBtn = $(".continue-button");
let currentClues;
let game;
let $gameBoard = $(".game-board");
let $gameRules = $(".game-rules");
let $nameInputSection = $(".player-name-input-section");
let players = [];
let playersWager;
let $player1Input = $(".player1");
let $player2Input = $(".player2");
let $player3Input = $(".player3");
let randomNumber1;
let randomNumber2;
let randomNumber3;
let response;
let selectedClue;
let totalClues;
let turns = 0;
let usedCategories = [];
let wagerAmount;

$clueCards.click(displaySelectedClue);
$continueBtn.click(instantiatePlayers);
$('.daily-double-guess-btn').click(evaluateDailyDoubleGuess);
$(".leaderboard-button").click(dropdownMenu);
$nameInputSection.keyup(checkInputs);
$(".play-button").click(instantiateGame);
$(".restart-button").click(restartGame);
$(".submit-DD-wager").click(checkDDWager);
$(".submit-final").click(evaluateFinalGuess);
$(".submit-guess").click(evaluateGuess);
$(".submit-wager").click(checkFinalWagers);


function categoryFetch() {
  return fetch("https://fe-apps.herokuapp.com/api/v1/gametime/1903/jeopardy/data")
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
  return fetch("https://fe-apps.herokuapp.com/api/v1/gametime/1903/jeopardy/data")
    .then(data => data.json())
    .then(data => data.data.clues)
    .then(clues => {
      let clueKeys = Object.keys(clues)
      clueKeys.forEach(key => clueInfo.push(clues[key]))
    })
    .catch(error => console.log(error))
}

function displayLeaders() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/gametime/leaderboard')
    .then(response => response.json())
    .then(data => data.highScores.filter(score => score.appId === '1909RNCGVA'))
    .then(filteredData => filteredData.sort((a, b) => b.playerScore - a.playerScore))
    .then(sortedData => sortedData.forEach(info => $(".winners-list").append(`<li class="winner-names-and-score">${info.playerName} | ${info.playerScore} </li>
          <div class="line"></div>`)))
}

function getFetches() {
  return Promise.all([clueFetch(), categoryFetch()])
}

displayLeaders();
getFetches()
  .then(() => instantiateClues())

function instantiateClues() {
  return clueInfo.map(c => {
    c.id = clueId;
    clue = new Clue(c);
    clueId++;
  })
}

// function postToLeaderBoard(winningPlayer) {
//   return fetch('https://fe-apps.herokuapp.com/api/v1/gametime/leaderboard', {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       appId: "1909RNCGVA",
//         playerName: `${winningPlayer.name}`,
//         playerScore: `${winningPlayer.score}`
//     })
//   })
// }

function checkInputs() {
  if ($player1Input.val() && $player2Input.val() && $player3Input.val()) {
    $continueBtn.attr("id", "active");
  }
}

function instantiatePlayers() {
  if (document.getElementById("active")) {
    let player1 = new Player($player1Input.val());
    let player2 = new Player($player2Input.val());
    let player3 = new Player($player3Input.val());
    players.push(player1, player2, player3);
    showRules();
  } else {
    $(".error").css("visibility", "visible");
  }
}

function showRules() {
  $nameInputSection.css("display", "none");
  $gameRules.css("display", "block");
}

function instantiateGame() {
  oneRandomInt(1, 16);
  game = new Game(players);
  game.updateRound();
  pickCategories();
  players[0].takeTurn();
  $(".player1-sidebar").css("background-color", "#88A5E9");
  showGame();
}

function pickCategories() {
  shuffleArray(clueCategories);
  let currentIndex = 0;
  let currentCategories = [];
  while (currentCategories.length !== 4) {
    if (!usedCategories.includes(clueCategories[`${currentIndex}`])) {
      currentCategories.push(clueCategories[`${currentIndex}`]);
      usedCategories.push(clueCategories[`${currentIndex}`]);
      $(`.category${currentCategories.length}`).text(`${clueCategories[`${currentIndex}`].category.split(/(?=[A-Z])/).join(" ").toUpperCase()}`);
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
}

function findCategoryClues(categories) {
  categories.forEach(category => {
    let categoryClues = clueInfo.filter(clue => clue.categoryId === category.id);
    shuffleArray(categoryClues);
    currentClues = [];
    let pointLevel = 1;
    while (pointLevel !== 5) {
      let clue = categoryClues.find(clue => clue.pointValue == `${pointLevel}00`);
      currentClues.push(clue);
      pointLevel++;
    }
    allClues.push(currentClues);
    addCluesToDom(currentClues);
  })
  totalClues = allClues.reduce((acc, val) => acc.concat(val), []);
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
  $(".player1-name").text($player1Input.val());
  $(".player2-name").text($player2Input.val());
  $(".player3-name").text($player3Input.val());
  $gameRules.css("display", "none");
  $gameBoard.css("display", "grid");
  $(".selected-clue-info").css("display", "grid");
  $(".game-categories").css("display", "flex");
  updatePlayerScore();
}

function updatePlayerScore() {
  $(".player1-score").text(players[0].score);
  $(".player2-score").text(players[1].score);
  $(".player3-score").text(players[2].score);
}

function displaySelectedClue(event) {
  let currentPlayer = players.find(player => player.turn);
  clickedCard = event.target.closest(".clue-card");
  if (!clickedCard) {
    return;
  }
  selectedClue = clueInfo.find(clue => clue.id == clickedCard.id)
  $clueCards.addClass("no-clicks");
  turns ++;
  if (turns === randomNumber1 || turns === randomNumber2 || turns === randomNumber3) {
    makeDailyDouble(currentPlayer);
  } else {
    let selectedCategory = clueCategories.find(category => category.id == selectedClue.categoryId);
    let selectedPoints = selectedClue.pointValue * game.roundCount;
    $(".selected-clue-category").text(`${selectedCategory.category.split(/(?=[A-Z])/).join(" ").toUpperCase()}`);
    $(".selected-clue-points").text(`${selectedPoints}`);
    $(".question").text(`${selectedClue.question}`);
  }
}

function removeCardFromTotal(card) {
  let cardToRemove = totalClues.find(clue => clue.id == card.id);
  let indexOfCard = totalClues.indexOf(cardToRemove);
  totalClues.splice(indexOfCard, 1);
}

function makeDailyDouble(player) {
  let dailyDouble = new DailyDouble(selectedClue)
  let highestPointClue = sortClues();
  wagerAmount = dailyDouble.determineWager(turns, player, highestPointClue);
  displayDailyDouble(wagerAmount);
}

function sortClues() {
  let sortedClues = totalClues.sort((a, b) => {
    return b.pointValue - a.pointValue;
  });
  return sortedClues[0].pointValue;
}

function displayDailyDouble(wager) {
  let selectedCategory = clueCategories.find(category => category.id === selectedClue.categoryId)
  $('.daily-double-wager').css("display", "flex");
  $('.daily-double-category').text(`${selectedCategory.category.split(/(?=[A-Z])/).join(" ").toUpperCase()}`);
  $('.daily-double-question').text(`${selectedClue.question}`);
  $('.daily-double-wager-amount').text(`Set your wager between 5 and ${wager} points.`)
  $('.clue-cards').css("display", "none");
  $('.selected-clue-info').css("display", "none");
  $('.game-categories').css("display", "none");
}

function evaluateDailyDoubleGuess() {
  if ($('.daily-double-input').val() === '') {
    return $('.guess-error').text("Please enter your guess below")
  } if ($('.daily-double-input').val().toUpperCase() === selectedClue.answer.toUpperCase()) {
    $('.answer-response').css("display", "flex");
    $(".response").text(`Correct! \n You get ${playersWager} points!`);
    response = "correct";
  } else {
    $('.answer-response').css("display", "flex");
    $(".response").text(`Incorrect! \n The answer is ${selectedClue.answer}. \n You lose ${playersWager} points!`)
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
  randomNumber1 = Math.floor(Math.random() * (max - min) + min);
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
  $(".final-round-wagers").css("display", "flex");
  $(".player1-label").text(players[0].name);
  $(".player2-label").text(players[1].name);
  $(".player3-label").text(players[2].name);
  $(".final-clue-category").text(`${category.category.split(/(?=[A-Z])/).join(" ").toUpperCase()}`);
  $(".final-clue-question").text(`${clue.question}`);
}

function dropdownMenu() {
  $(".dropdown-menu").toggleClass("hide");
  $("main").toggleClass("no-clicks");
}

function restartGame() {
  $nameInputSection.css("display", "block");
  $gameRules.css("display", "none");
  $gameBoard.css("display", "none");
  $(".winner-screen").css("display", "none");
  $clueCards.html("");
  resetValues();
}

function resetValues() {
  players = [];
  turns = 0;
  clueCount = 0;
  usedCategories = [];
  $(`.player1-sidebar`).css("background-color", "transparent");
  $(`.player2-sidebar`).css("background-color", "transparent");
  $(`.player3-sidebar`).css("background-color", "transparent");
  $(".player1").val("");
  $(".player2").val("");
  $(".player3").val("");
  $(".player1-wager").val("");
  $(".player2-wager").val("");
  $(".player3-wager").val("");
  $(".player1-final").val("");
  $(".player2-final").val("");
  $(".player3-final").val("");
  $(".continue-button#active").removeAttr('id');
  resetClue();
}

function evaluateGuess() {
  if ($(".player-guess").val() && $(`#${selectedClue.id}`).css("visibility") === "visible") {
    response;
    let points = selectedClue.pointValue * game.roundCount;
    $(".answer-response").css("display", "flex");
    if ($(".player-guess").val().toUpperCase() === selectedClue.answer.toUpperCase()) {
      $(".response").text(`Correct! \n You get ${points} points!`);
      response = "correct";
    } else {
      $(".response").text(`Incorrect! \n The answer is ${selectedClue.answer}. \n You lose ${points} points!`)
      response = "incorrect";
    }
    calculateScore(response);
  }
  $(".player-guess").val("");
}

function checkFinalWagers() {
  if ($(".player1-wager").val() && $(".player2-wager").val() && $(".player3-wager").val()) {
    let wager1 = {wager: $(".player1-wager").val(), playerScore: players[0].score};
    let wager2 = {wager: $(".player2-wager").val(), playerScore: players[1].score};
    let wager3 = {wager: $(".player3-wager").val(), playerScore: players[2].score};
    let acceptableWagers = [];
    let allWagers = [wager1, wager2, wager3]
    allWagers.forEach(w => {
      if (Number(w.wager) <= 0) {
        $(".final-wager-error").text("You must input wagers greater than or equal to 5!");
      }
      if (w.playerScore > 0) {
        if (Number(w.wager) <= w.playerScore && Number(w.wager) >= 5) {
          acceptableWagers.push(w.wager)
        } else {
          $(".final-wager-error").text("Your wager must be a positive number between 5 and your current total score!");
        }
      } else {
        if (Number(w.wager) === 5) {
          acceptableWagers.push(w.wager)
        } else {
          $(".final-wager-error").text("Your wager must be 5 if your current score is 0 or less");
        }
      }
    })
    if (acceptableWagers.length === 3) {
      collectWagers();
    }
  } else {
    $(".final-wager-error").text("You must input 3 wagers!");
  }
}

function collectWagers() {
  $(".final-wager-error").text("");
  $(".final-round-wagers").css("display", "none");
  $(".final-round-question").css("display", "flex");
  players[0].wager = $(".player1-wager").val();
  players[1].wager = $(".player2-wager").val();
  players[2].wager = $(".player3-wager").val();
}

function evaluateFinalGuess() {
  players[0].finalGuess = $(".player1-final").val().toUpperCase();
  players[1].finalGuess = $(".player2-final").val().toUpperCase();
  players[2].finalGuess = $(".player3-final").val().toUpperCase();
  players.forEach(player => {
    if (player.finalGuess === selectedClue.answer.toUpperCase()) {
      player.increaseScore(player.wager);
    } else {
      player.decreaseScore(player.wager);
    }
  })
  let winner = game.determineWinner();
  showFinalAnswer(winner);
}

function checkDDWager() {
  if ($(".daily-double-wager-input").val() > wagerAmount || $(".daily-double-wager-input").val() < 5) {
    $(".daily-double-wager-input").val("")
    $(".daily-double-wager-input").css("border", "solid red 2px")
    $(".error-message").text("Enter an amount between the specified range.")
  } else {
    playersWager = $('.daily-double-wager-input').val();
    displayDailyDoubleQuestion();
  }
}

function displayDailyDoubleQuestion() {
  $(".daily-double-wager-input").css("border", "none")
  $(".error-message").text("")
  $('.daily-double-wager').css('display', 'none')
  $('.daily-double-question-div').css('display', 'block')
}

function showFinalAnswer(winner) {
  $(".final-round-question").css("display", "none");
  $(".final-answer").css("display", "flex");
  $(".final-round-answer").text(`The correct answer was ${selectedClue.answer}!`);
  setTimeout(function() { displayWinner(winner); }, 2500);
}

function displayWinner(winner) {
  $(".final-answer").css("display", "none");
  $(".game-board").css("display", "none");
  $(".winner-screen").css("display", "block");
  $(".winner").text(winner.name);
  $(".first-place-score").text(`${winner.score} Points`);
  $(".second-place-score").text(`${players[1].score} Points`);
  $(".second-place-name").text(players[1].name);
  $(".third-place-score").text(`${players[2].score} Points`);
  $(".third-place-name").text(players[2].name);
}

function calculateScore(response) {
  let currentPlayer = players.find(player => player.turn);
  if (response === "correct") {
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
    currentPlayer.score += Number(playersWager);
  } else {
    currentPlayer.score -= Number(playersWager);
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
  }
  if (clueCount === 32) {
    game.updateRound();
    startFinalRound();
  }
}

function resetClue() {
  $(".selected-clue-category").text("");
  $(".selected-clue-points").text("");
  $(".question").text("");
}

function updateGameDisplay(player) {
  $(`#${selectedClue.id}`).css("visibility", "hidden");
  $(".game-board").css("pointer-events", "none")
  setTimeout(function() { $(".answer-response").css("display", "none")}, 1500);
  setTimeout(function() { $(".game-board").css("pointer-events", "auto")}, 1500);
  setTimeout(function() { updateClueCount(); }, 2000);
  setTimeout(function () { switchPlayer(player); }, 1500);
  setTimeout(function () { $clueCards.removeClass("no-clicks"); }, 2000);
}

function switchPlayer(player) {
  removeCardFromTotal(clickedCard);
  player.takeTurn();
  let i = players.indexOf(player);
  $(`.player${i + 1}-sidebar`).css("background-color", "transparent");
  if (players[players.indexOf(player) + 1]) {
    players[players.indexOf(player) + 1].takeTurn();
    $(`.player${i + 2}-sidebar`).css("background-color", "#88A5E9");
  } else {
    players[0].takeTurn();
    $(".player1-sidebar").css("background-color", "#88A5E9");
  }
}

function startRound2() {
  twoRandomInts(17, 32)
  $(".clue-cards").html("");
  $(".selected-clue-category").text("");
  $(".selected-clue-points").text("");
  $(".question").text("");
  allClues = [];
  pickCategories(2);
}

function startFinalRound() {
  $(".clue-cards").html("");
  $(".selected-clue-info").css("display", "none");
  $(".game-categories").css("display", "none");
  findFinalCategory();
}
