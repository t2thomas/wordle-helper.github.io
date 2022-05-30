var keyboard = [ "QWERTYUIOP".split(""),
                   "ASDFGHJKL".split(""),
                   "ZXCVBNM".split("") ];
keyboard[2].unshift("Enter");
keyboard[2].push("Backspace") ;

function drawKeyboard(){
  whereToDraw = document.getElementById('keyboard-container');

  for (var i = 0; i < keyboard.length; i++) {
    for (var j = 0; j < keyboard[i].length; j++) {
      let key = document.createElement("kbd");
      key.classList.add('button');
      key.setAttribute('id', keyboard[i][j]);
      if(keyboard[i][j] == "Backspace"){
        key.innerHTML = "<i class='material-icons'>backspace</i>"
      }
      else if(keyboard[i][j] == "Enter"){
        key.innerHTML = "<i class='material-icons'>keyboard_return</i>"
      }
      else {
        key.innerText = keyboard[i][j].toUpperCase();
      }
      key.onclick = function() {
        handleKeystroke(key.id);
      };
      whereToDraw.appendChild(key);
    }
    whereToDraw.appendChild(document.createElement("br"));
  }
}
