// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import Clue from '../src/Clue'
import '../src/Game'
import '../src/Player'
import '../src/Round'
// import { promises } from 'dns';

let clue;
let clueCategories = [];
let clueInfo = [];



function categoryFetch() {
 return fetch('https://fe-apps.herokuapp.com/api/v1/gametime/1903/jeopardy/data')
  .then(data => data.json())
  .then(data => data.data.categories)
  .then(categories => {
    let catKeys = Object.keys(categories)
    catKeys.forEach(key => clueCategories.push({[key]: categories[key]}))
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
    console.log(clue) 
  })
}

getFetches()
.then(() => instantiateClues())


instantiateClues()
  

  