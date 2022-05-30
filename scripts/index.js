var currentId = 0;
var endOfLineWaitingConfirmation = false;
var allWordsCompleted = false;
let numRows = 6;
let numCols = 5;
let answerFileLocation = "../assets/wordle_answer_list_sorted.txt";

let restingInstruction = "Complete atleast one word to be able to get your available options. Tap on letters to change colors to indicate the clues given by Wordle. "
let awaitingConfirmationInstruction = "Tap on letters to change colors. Click on 'Next word' or hit the return key to continue entering letters. Click on 'Get Options' to get available word options."

// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);

window.addEventListener('load', function(event) {
  document.getElementById('next-word').disabled = true;
  document.getElementById('get-options').disabled = true;

  document.getElementById('instruction-panel').innerHTML = restingInstruction;
  createWordleCells();
  drawKeyboard();
});

window.addEventListener('keydown', function(event) {
  handleKeystroke(event.key);
});

document.getElementById("next-word").onclick = function () {
  getNextWord();
};

document.getElementById("reset-button").onclick = function () {
  resetAll();
};

document.getElementById("get-options").onclick = function () {
  getAllOptions();
};

document.getElementById("dismiss-answers-panel").onclick = function () {
  dismissAnswersPanel();
};

document.getElementById("instruction-panel").addEventListener("animationend", (e) => {
  document.getElementById('instruction-panel').classList.remove('apply-shake');
});

function selectCurrentCell(id) {
  document.getElementById(id).classList.add('word-cell-selected');
};

function removeCurrentCell(id) {
  document.getElementById(id).classList.remove('word-cell-selected');
};

function isLetter(char) {
  return /^[A-Z]$/i.test(char);
};

function handleKeystroke(char) {
  /* This function is called by physical keyboard or virtual keyboard on a laptop, but by virtual keyboard on a mobile device */
  if ( isLetter(char) && (!endOfLineWaitingConfirmation) && (currentId<numCols*numRows) ) {
    char = char.toUpperCase();
    document.getElementById(currentId.toString()).innerText = char;
    removeCurrentCell(currentId);

    currentId += 1;

    if ((currentId % numCols == 0) && (currentId != 0)) {
      endOfLineWaitingConfirmation = true;
      document.getElementById('instruction-panel').innerHTML = awaitingConfirmationInstruction;
      document.getElementById('instruction-panel').classList.add('apply-shake');
      document.getElementById('next-word').disabled = false;
      document.getElementById('get-options').disabled = false;
    } else {
      selectCurrentCell(currentId);
    };

  }
  else if (char == "Enter")  {
    getNextWord();
  }
  else if ((char == "Backspace") && (currentId!= 0)){
    if(endOfLineWaitingConfirmation){
      endOfLineWaitingConfirmation = false;
      document.getElementById('instruction-panel').innerHTML = restingInstruction;
      document.getElementById('next-word').disabled = true;
      document.getElementById('get-options').disabled = true;
    }
    else{
      removeCurrentCell(currentId);
    }
    currentId-=1;
    document.getElementById(currentId.toString()).innerText = "";
    document.getElementById(currentId.toString()).classList.remove('word-cell-state1','word-cell-state2');
    document.getElementById(currentId.toString()).classList.add('word-cell-state0');
    selectCurrentCell(currentId);
  };
};

function createWordleCells() {
  var container = document.getElementById('word-entry-container');
  makeCells(numRows, numCols, container);
};

function makeCells(numRows, numCols, container) {
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
      let box = document.createElement("div");
      box.classList.add('word-cell', 'word-cell-state0');
      if ((i == 0) && (j == 0)) {
        box.classList.add('word-cell-selected');
      }
      box.setAttribute('id', (i * numCols + j).toString());
      box.onclick = function() {
        cellStateOnClick(box)
      };
      container.appendChild(box);
    };
    let lbrk = document.createElement("br");
    container.appendChild(lbrk);
  };
};

function getBoxState(boxObject){
  var classes = boxObject.classList;
  if( classes.contains('word-cell-state0') ){
    return(0);
  }
  else if(classes.contains('word-cell-state1')){
    return(1);
  }
  else if(classes.contains('word-cell-state2')){
    return(2);
  }
}

function cellStateOnClick(box) {
  if (box.innerText != "") {
    if (box.classList.contains('word-cell-state0')) {
      box.classList.remove('word-cell-state0');
      box.classList.add('word-cell-state1');
    } else if (box.classList.contains('word-cell-state1')) {
      box.classList.remove('word-cell-state1');
      box.classList.add('word-cell-state2');
    } else if (box.classList.contains('word-cell-state2')) {
      box.classList.remove('word-cell-state2');
      box.classList.add('word-cell-state0');
    };
  };
};

function dismissAnswersPanel(){
  document.getElementById('answers-panel').style.display="none";
  //document.getElementById('answers-panel').classList.remove('visible');
  //document.getElementById('answers-panel').classList.add('invisible');
}

function getNextWord(){
  if(endOfLineWaitingConfirmation && (currentId < numCols*numRows)){
    endOfLineWaitingConfirmation = false;
    document.getElementById('instruction-panel').innerHTML = restingInstruction;

    document.getElementById('next-word').disabled = true;
    document.getElementById('get-options').disabled = true;
    selectCurrentCell(currentId);
  }
  else{
    document.getElementById('instruction-panel').classList.add('apply-shake');
  }
};

function resetAll(){
  endOfLineWaitingConfirmation = false;
  document.getElementById('instruction-panel').innerHTML = restingInstruction;

  currentId = 0;

  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
      document.getElementById((i*numCols + j).toString()).innerText = "";
      document.getElementById((i*numCols + j).toString()).classList.remove('word-cell-state1','word-cell-state2','word-cell-selected');
      document.getElementById((i*numCols + j).toString()).classList.add('word-cell-state0');
    }
  }

  document.getElementById("0").classList.add('word-cell-selected')
  document.getElementById('next-word').disabled = true;
  document.getElementById('get-options').disabled = true;

  dismissAnswersPanel();
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getAllWordsFromInnerHTML(){
  var words = [];
  var i = 0;
  var j = 0;
  var currentWord = "";

  while( i*numCols + j < currentId ){
    var one_char = document.getElementById( (i*numCols + j).toString() ).innerText;

    //console.log( currentId, i*numCols + j, i, j, one_char);
    currentWord = currentWord.concat(one_char);
    if(currentWord.length == numCols){
      words.push( currentWord );
      //console.log( currentWord );
      currentWord = "";
      j++;
    }
    if(j<numCols){
      j++;
    }
    else{
      i++;
      j=0;
    }
  }
  return(words);
}

function getAllCluesFromInnerHTML(){
  var clues = [];
  var i = 0;
  var j = 0;
  var currentWordStates = [];

  while( i*numCols + j < currentId ){
    var one_state = getBoxState( document.getElementById( (i*numCols + j).toString() ) );

    //console.log( currentId, i*numCols + j, i, j, one_state);
    currentWordStates.push(one_state);
    if(currentWordStates.length == numCols){
      clues.push( currentWordStates );
      //console.log( currentWordStates );
      currentWordStates = [];
      j++;
    }
    if(j<numCols){
      j++;
    }
    else{
      i++;
      j=0;
    }
  }
  return(clues);
}

function getAllOptions(){
  getNextWord();

  allWords = getAllWordsFromInnerHTML();
  allClues = getAllCluesFromInnerHTML();
  //console.log(allWords, allClues);
  //bankOfWords = getAllPossibleAnswersFromFile();
  bankOfWords = wordGuessPool;
  bankOfWords = filterAll( bankOfWords, allWords, allClues);
  //bankOfWords = allWords;
  //bankOfWords = ['SNUCK','PRICK','SASSY','SWEAR','PLIER','CLAVE','SNACK','STOCK','BREAD','FRANK','LEGGY','TONKS','WRECK'];

  document.getElementById('heading-jumbotron').innerText = "You have " + bankOfWords.length.toString() + " option(s)."
  var ansContainer = document.getElementById('all-answers');
  removeAllChildNodes(ansContainer);

  for (var i = 0; i < bankOfWords.length; i++) {
    let thisDiv = document.createElement("div");
    thisDiv.classList.add("col-2","border","text-center","single-word");
    thisDiv.innerText = " " + bankOfWords[i] + " ";
    ansContainer.appendChild(thisDiv);
  }

  document.getElementById('answers-panel').style.display = "inline-block";
}
