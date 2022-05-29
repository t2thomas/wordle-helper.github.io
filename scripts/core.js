function filterOne( bankOfWords, thisWord, clues ){

  //TODO: check if len of clues == len of lastWord

  for (var i = 0; i < thisWord.length; i++) {


    // if clue[i] == 0
        // k = num of other positive ocurrences of thisWord[i] in thisWord
        // also eliminate all words with thisWord[i] at ith position
        // if k==0, eliminate all words with this letter anywhere at  all
    if(clues[i] == 0){
      var k = otherOccurences(i, thisWord, clues);

      //console.log(k, thisWord[i]);
      bankOfWords = eliminateWordsLTKOccurences(bankOfWords, k, thisWord[i]);
      //console.log(thisWord[i] + " identified as state 0 => after LTK" +  ", num of words in bank : " + bankOfWords.length );

      //console.log(i, thisWord[i]);
      bankOfWords = eliminateWordsCharAtI(bankOfWords, i, thisWord[i]);
      //console.log(thisWord[i] + " identified as state 0 => after eliminating words with it at this position" +  ", num of words in bank : " + bankOfWords.length );

      if(k==0){
        bankOfWords = eliminateWordsWithThisCharAnywhere(bankOfWords, thisWord[i]);
      }

    }

    //if clue[i] == 1 and thisWord[i] occurs k times positively in any other place based on allClues
      //eliminate all words from wordbank that have thisWord[i] less than k+1 times
      //eliminate all words from wordbank when thisWord[i] is in the i-th position
    else if(clues[i] == 1){
      var k = otherOccurences(i, thisWord, clues);

      //console.log(k, thisWord[i]);
      bankOfWords = eliminateWordsLTKOccurences(bankOfWords, k+1, thisWord[i]);
      //console.log(thisWord[i] + " identified as state 1 => after LTK" +  ", num of words in bank : " + bankOfWords.length );

      //console.log(i, thisWord[i]);
      bankOfWords = eliminateWordsCharAtI(bankOfWords, i, thisWord[i]);
      //console.log(thisWord[i] + " identified as state 1 => after eliminating words with it at this position" +  ", num of words in bank : " + bankOfWords.length );
    }

    // if clue[i] == 2 and thisWord[i] occurs k times positively in any other place based on allClues
      //eliminate all words from wordbank that have thisWord[i] less than k+1 times
      //eliminate all words from wordbank that have thisWord[i] NOT in the i-th position
    else if(clues[i] == 2){
        var k = otherOccurences(i, thisWord, clues);

        //console.log(k, thisWord[i]);
        bankOfWords = eliminateWordsLTKOccurences(bankOfWords, k+1, thisWord[i]);
        //console.log(thisWord[i] + " identified as state 2 => after LTK" +  ", num of words in bank : " + bankOfWords.length );

        //console.log(i, thisWord[i]);
        bankOfWords = eliminateWordsCharNotAtI(bankOfWords, i, thisWord[i]);
        //console.log(thisWord[i] + " identified as state 2 => after eliminating words without it at this position" +  ", num of words in bank : " + bankOfWords.length );

      }
    //console.log("Letter analyzed: " + thisWord[i] + ", num of words in bank : " + bankOfWords.length );

  }
  return(bankOfWords);
}


function otherOccurences(i, thisWord, clues) {
  /*Returns number of times letter at index i occurs at any other location, based on clues
  for example:
  console.log(otherOccurences(1, 'SLACK', [0,0,1,1,2])) should return 0
  console.log(otherOccurences(1, 'SASSY', [0,0,1,1,2])) should return 0
  console.log(otherOccurences(0, 'SASSY', [0,0,1,1,2])) should return 2 -> although this won't happen in wordle since first occurence is always tagged
  console.log(otherOccurences(3, 'BLISS', [0,0,1,1,0])) should return 0
  console.log(otherOccurences(3, 'BLISS', [0,0,1,1,1])) should return 1
  console.log(otherOccurences(4, 'BLISS', [0,0,1,1,1])) should return 1
  console.log(otherOccurences(4, 'BLISS', [0,0,1,2,1])) should return 1
  console.log(otherOccurences(4, 'BLISS', [0,0,1,2,0])) should return 1
  console.log(otherOccurences(4, 'BLISS', [0,0,1,0,0])) should return 0
  console.log(otherOccurences(3, 'SASSY', [1,0,2,0,0])) should return 2
  console.log(otherOccurences(3, 'SASSY', [0,0,2,0,0])) should return 1
  */
  var ctr = 0;
  char = thisWord[i];
  for (var j = 0; j < thisWord.length; j++) {
    if ( (char == thisWord[j]) && ([1, 2].includes(clues[j])) && (i!=j)) {
      ctr++;
    }
  }
	return (ctr);
}

function eliminateWordsLTKOccurences(bankOfWords, k, char){
  /* eliminates words from bankOfWords that have less than k occurences of char
    for example
    (1) console.log(eliminateWordsLTKOccurences(['CHILD','STUMP','SHARK','SLACK', 'BLISS'], 2, 'S')) should print
    ['BLISS']
    (2) eliminateWordsLTKOccurences(['CHILD','STUMP','SHARK','SLACK', 'BLISS'], 1, 'S') should return
    ['STUMP','SHARK','SLACK', 'BLISS']
    (3) eliminateWordsLTKOccurences(['CHILD','STUMP','SHARK','SLACK', 'BLISS'], 0, 'S') should return
    ['CHILD','STUMP','SHARK','SLACK', 'BLISS']
  */
  return( bankOfWords.filter(function(str){
    var n_occurence = (str.match(new RegExp(char, "g")) || []).length; //number of occurences of char in str
    return(n_occurence >= k);
  }));
}

function eliminateWordsWithThisCharAnywhere(bankOfWords, char){
  return( bankOfWords.filter(function(str){
                    return (!str.includes(char));} ));
}

function eliminateWordsCharAtI(bankOfWords, i, char){
  /* eliminates words from bankOfWords that have char at position i
    for example
    (1) console.log(eliminateWordsCharAtI(['CHILD','STUMP','SHARK','SLACK', 'BLISS'], 0, 'S')) should print
    ['CHILD','BLISS']
    (2) console.log(eliminateWordsCharAtI(['CHILD','STUMP','SHARK','SLACK', 'BLISS'], 1, 'H')) should print
    ['STUMP','SLACK', 'BLISS']
    (3) console.log(eliminateWordsCharAtI(['CHILD','STUMP','SHARK','SLACK', 'BLISS'], 1, 'Z')) should print
    ['CHILD','STUMP','SHARK','SLACK', 'BLISS']
  */
  return( bankOfWords.filter(function(str){
                    return (str[i] != char);}));
}


function eliminateWordsCharNotAtI(bankOfWords, i, char){
  /* eliminates words from bankOfWords that have char at position i
    for example
    (1) console.log(eliminateWordsCharNotAtI(['CHILD','STUMP','SHARK','SLACK', 'BLISS'], 0, 'S')) should print
    ['STUMP','SHARK','SLACK']
    (2) console.log(eliminateWordsCharNotAtI(['CHILD','STUMP','SHARK','SLACK', 'BLISS'], 1, 'H')) should print
    ['CHILD','SHARK']
    (3) console.log(eliminateWordsCharNotAtI(['CHILD','STUMP','SHARK','SLACK', 'BLISS'], 1, 'Z')) should print
    []
  */
  return( bankOfWords.filter(function(str){
                    return (str[i] == char);}));
}

function filterAll( bankOfWords, allWords, allClues){

  //TODO: check if len of allWords == len of allClues

  allWords = allWords.map(element => {
    return element.toLowerCase();
  });

  //console.log( "Original num of words in bank : " + bankOfWords.length );

  for (var i = 0; i < allWords.length; i++) {
    bankOfWords = filterOne(bankOfWords, allWords[i], allClues[i]);
    //console.log( "word: " + i.toString() + ", num of words in bank : " + bankOfWords.length );
  };
  return(bankOfWords);
}
