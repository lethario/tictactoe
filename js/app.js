// global variables

var user = {symbol: ""};
var computer = {symbol: "", turn: true};
var board = {"1": "", "2": "", "": "",
             "4": "", "5": "", "6": "",
             "7": "", "8": "", "9": ""};

// all-around functions
var randomInt = function (max) {
  return Math.floor(Math.random() * (max + 1));
}

String.prototype.count=function(s1) {
  return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
}

// console-specific functions

markToString = function (str) {
  if (str === "") {
    return " ";
  } else {
    return str;
  }
}

logBoardToConsole = function() {
  console.log("|" + markToString(board[1]) + "|" + markToString(board[2]) + "|" + markToString(board[3]) + "|");
  console.log("|" + markToString(board[4]) + "|" + markToString(board[5]) + "|" + markToString(board[6]) + "|");
  console.log("|" + markToString(board[7]) + "|" + markToString(board[8]) + "|" + markToString(board[9]) + "|");
  console.log("-------------------------");
}

// tic-tac-toe logic

var nullBoard = function() {
  return {"1": "", "2": "", "3": "",
          "4": "", "5": "", "6": "",
          "7": "", "8": "", "9": ""};
}

var markSquare = function(square, symbol) {
  board[square] = symbol;
}

var unmarkSquare = function(square) {
  board[square] = "";
}

var isAvailable = function (square) {
  if (board[square]) {
    return false;
  } else {
    return true;
  }
}

var availableSquares = function (squares) {
  avsqs = [];
  for (var sqr in squares) {
    if (isAvailable(squares[sqr])) {
      avsqs.push(squares[sqr]);
    }
  }
  return avsqs;
}

var hasSymbol = function (square,symbol) {
  return board[square] === symbol;
}

var isSpecialCase = function (symbol) {
  return numOfAvailableSquares(Object.keys(board)) === 6 &&
         hasSymbol(5,computer.symbol) &&
       ((hasSymbol(1,user.symbol) && hasSymbol(9,user.symbol)) ||
        (hasSymbol(3,user.symbol) && hasSymbol(7,user.symbol)));
}

var haveSymbol = function (squares,symbol) {
  return (board[squares[0]] + board[squares[1]] + board[squares[2]] ===
          symbol + symbol + symbol);
}

var numOfAvailableSquares = function (squares) {
  return availableSquares(squares).length;
}

var symbolInCorners = function (symbol) {
  cornerarr = [];
  crnrs = ["1","3","7","9"];
  for (var corner in crnrs) {
      if (hasSymbol(crnrs[corner],symbol)) {
        cornerarr.push(crnrs[corner]);
      }
  }
  return cornerarr;
}

var oppositeCorner = function (square) {
  switch (parseInt(square)) {
    case 1: return 9;
    case 3: return 7;
    case 7: return 3;
    case 9: return 1;
  }
}

var randomCorner = function () {
  return [1,3,7,9][randomInt(3)];
}

var freeOppositeCorner = function (symbol) {
  symbolsincorners = symbolInCorners(symbol);
  for (var symbolcorner in symbolsincorners) {
    opposite = oppositeCorner(symbolsincorners[symbolcorner]);
    if (isAvailable(opposite)) {
      return opposite;
    }
  }
  return null;
}

var oneIsAvailable = function (squares) {
  return numOfAvailableSquares(squares) === 1;
}

var rowHasWinningOpportunity = function (squares,symbol) {
  rowstring = "";
  for (var sq in squares) {
    rowstring += board[squares[sq]];
  }
  return rowstring.length === 2 && rowstring.count(symbol) === 2;
}


var winningRows = function (symbol) {
  winarr = [];
  wr = [1,4,7];
  for (var j in wr) {
    if (rowHasWinningOpportunity([wr[j],wr[j]+1,wr[j]+2],symbol)) {
      winarr.push([wr[j],wr[j]+1,wr[j]+2]);
    }
  }
  wr = [1,2,3];
  for (var j in wr) {
    if (rowHasWinningOpportunity([wr[j],wr[j]+3,wr[j]+6],symbol)) {
      winarr.push([wr[j],wr[j]+3,wr[j]+6]);
    }
  }
  if (rowHasWinningOpportunity([1,5,9],symbol)) {
    winarr.push([1,5,9]);
  }
  if (rowHasWinningOpportunity([3,5,7],symbol)) {
    winarr.push([3,5,7]);
  }
  return winarr;
}

var canBeFork = function (square,symbol) {
  markSquare(square,symbol);
  if (winningRows(symbol).length > 1) {
    unmarkSquare(square);
    return true;
  }
  unmarkSquare(square);
  return false;
}

var forkSquare = function (symbol) {
  available = availableSquares(Object.keys(board));
  for (var avsq in available) {
    if (canBeFork(available[avsq],symbol)){
      return available[avsq];
    }
  }
  return null;
}

var determineSides = function (booleanvalue) {
  computer.turn = booleanvalue;
  if (booleanvalue) {
    user.symbol = "o";
    computer.symbol = "x";
  } else {
    user.symbol = "x";
    computer.symbol = "o";
  }
}

var computerStep = function(square) {
  takeTurn(square,computer.symbol);
}

var computerStepsRandom = function() {
  while (true) {
    square = randomInt(8) + 1;
    if (isAvailable(square)) {
      takeTurn(square,computer.symbol);
      break;
    }
  }
}

var winRow = function (symbol) {
  row = [1,4,7];
  for (var k in row) {
    if (haveSymbol([row[k],row[k]+1,row[k]+2],symbol)) {
      return [row[k],row[k]+1,row[k]+2];
    }
  }
  row = [1,2,3];
  for (var k in row) {
    if (haveSymbol([row[k],row[k]+3,row[k]+6],symbol)) {
      return [row[k],row[k]+3,row[k]+6];
    }
  }
  if (haveSymbol([1,5,9],symbol)) {
    return [1,5,9];
  } else if (haveSymbol([3,5,7],symbol)) {
    return [3,5,7];
  }
  return null;
}

var startGame = function () {
  console.log("-------------------------");
  console.log("Welcome to the backstage!");
  console.log("-------------------------");
  if (computer.turn) {
    computerStep(randomCorner());
  }
}

var takeTurn = function (square,symbol) {
  if (isAvailable(square)) {
    markSquare(square,symbol);
    if (computer.turn) {
      console.log("I (" + symbol + ") mark square " + square.toString() + ".");
    } else {
      console.log("You (" + symbol + ") mark square " + square.toString() + ".");
    }
    logBoardToConsole();
    markSquareUI(square,symbol);
    computer.turn = !computer.turn;

    if (winRow(user.symbol)) {
      console.log("You win! Please tell Oliver how you managed that!");
      endGameUI("You win!",winRow(user.symbol));
      return;
    } else if (winRow(computer.symbol)) {
      console.log("I win!");
      endGameUI("I win!",winRow(computer.symbol));
      return;
    }
    if (numOfAvailableSquares(Object.keys(board)) === 0) {
      console.log("It's a draw!");
      endGameUI("Draw!",[]);
      return;
    }
  }
  if (computer.turn) {
    if (winningRows(computer.symbol).length > 0) {
      console.log("I'll win with this step!");
      computerStep(availableSquares(winningRows(computer.symbol)[0])[0]);
    } else if (winningRows(user.symbol).length > 0) {
      console.log("I'll block you from winning.");
      computerStep(availableSquares(winningRows(user.symbol)[0])[0]);
    } else if (isSpecialCase(user.symbol)){
      console.log("I'll block you from creating a double-fork opportunity.");
      computerStep([2,4,6,8][randomInt(3)]);
    } else if (forkSquare(computer.symbol)) {
      console.log("I'll create a fork.");
      computerStep(forkSquare(computer.symbol));
    } else if (forkSquare(user.symbol)) {
      console.log("I'll block your fork.");
      computerStep(forkSquare(user.symbol));
    } else if (isAvailable(5)){
      console.log("I'll take the center.");
      computerStep(5);
    } else if (freeOppositeCorner(user.symbol)){
      console.log("I'll take your opposite corner.");
      computerStep(freeOppositeCorner(user.symbol));
    } else if (availableSquares([1,3,7,9]).length > 0){
      console.log("I'll take a corner.");
      computerStep(availableSquares([1,3,7,9])[0]);
    } else if (availableSquares([2,4,6,8]).length > 0){
      console.log("I'll take a side.");
      computerStep(availableSquares([2,4,6,8])[0]);
    } else {
      console.log("I'll take a random square... If you see this text, please let Oliver know!");
      computerStepsRandom();
    }
  }
}

// jQuery

var changeHeading = function(text) {
  jQuery("#gametext").html(text + " Who goes first?");
}

var addIconToSquare = function (square,symbol) {
  addIcon("#square" + square,symbol);
}

var addIcon = function (element,symbol) {
  if (symbol === "x") {
    jQuery(element).append("<i class='fa fa-times'>");
  } else {
    jQuery(element).append("<i class='fa fa-circle-o'>");
  }
}

var addClassToSquare = function(square,classname) {
  jQuery("#square" + square).addClass(classname);
}

var removeClassFromSquare = function(square,classname) {
  jQuery("#square" + square).removeClass(classname);
}

var markSquareUI = function(square,symbol) {
  removeClassFromSquare(square,"available");
  jQuery("#square" + square).empty();
  if (symbol === user.symbol) {
    addClassToSquare(square,'user');
  } else {
    addClassToSquare(square,'computer');
  }
  addIconToSquare(square,symbol);
  addClassToSquare(square,symbol);
}

var setUpBoard = function(booleanvalue) {
  jQuery("td").empty();
  jQuery("td").removeClass();
  jQuery("td").addClass('available');
  jQuery("#textdiv").addClass('hiddendiv');
  jQuery("#textdiv").removeClass('visiblediv');
  jQuery("#gamediv").removeClass('transparent');
  jQuery("#gamediv").addClass('visiblediv');
  jQuery("#gamediv").removeClass('hiddendiv');
  determineSides(booleanvalue);
  addIcon(".available",user.symbol);
  board = nullBoard();
  startGame();
}

var endGameUI = function (text,winrow) {
  allsquares = Object.keys(board);
  for (var sq in allsquares) {
    if (winrow.indexOf(parseInt(allsquares[sq])) === -1 && !isAvailable(allsquares[sq])) {
      addClassToSquare(allsquares[sq],"grey");
    }
  }
  changeHeading(text);
  jQuery("#gamediv").addClass('transparent');
  jQuery("#textdiv").removeClass('hiddendiv');
  jQuery("#textdiv").addClass('visiblediv');
}
