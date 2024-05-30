window.onload = function(){
  let gameSpeed;
  function initializeGame() {
    let score = 0;
    let level = 1;
    const gameBoard = $("#gameBoard");
    const nextBlockArea = $("#nextBlockArea");
    let timer;
    let currentBlock;
    let nextBlock;
    let requestId;
    

    let selectedLevel = getSelectedLevel();
    switch (selectedLevel) {
      case "easy":
        gameSpeed = 700;
        break;
      case "medium":
        gameSpeed = 500;
        break;
      case "hard":
        gameSpeed = 300;
        break;
      default:
        gameSpeed = 700;
    }
    
    
    gameBoard.empty();
    startGame();
  }

  function startGame() {

    requestId = null;
    score = 0;
    level = 1;
    $("#score").text(score);
    $("#level").text(level);

    for (var i = 0; i < 20; i++) {
      var row = $("<div class='row'></div>");
      for (var j = 0; j < 10; j++) {
        var cell = $("<div class='cell'></div>");
        row.append(cell);
      }
      $("#gameBoard").append(row);
    }
    
    currentBlock = generateBlock();
    drawBlock(currentBlock);
    nextBlock = generateBlock();
    drawNextBlock(nextBlock);

    gameLoop();

    $(document).on("keydown", handleKeyPress);
  }

  function gameLoop() {
    requestId = requestAnimationFrame(gameLoop);

    if (!currentBlock) { 
      return;
    }

    if (Date.now() - currentBlock.lastMoveTime > gameSpeed) {
      moveBlockDown();
      currentBlock.lastMoveTime = Date.now(); 
    }

    if (!canMoveDown(currentBlock)) {
      checkForCompleteRows();
      currentBlock = nextBlock;
      nextBlock = generateBlock();
      drawNextBlock(nextBlock);

      if (isGameOver(currentBlock)) {
        endGame();
      }
    }
  }
  function getSelectedBlocks() {
    var urlParams = new URLSearchParams(window.location.search);
    var encodedBlocks = urlParams.get("blocks");
    if (encodedBlocks) {
      return JSON.parse(decodeURIComponent(encodedBlocks));
    }
    return ["I", "O", "T", "S", "Z", "J", "L"];
  }


  function generateBlock() {
    var selectedBlocks = getSelectedBlocks();
    var randomIndex = Math.floor(Math.random() * selectedBlocks.length);
    var blockType = selectedBlocks[randomIndex];
    var block = {
      type: blockType,
      color: getBlockColor(blockType),
      shape: getBlockShape(blockType),
      row: 0,
      col: Math.floor((10 - getBlockWidth(blockType)) / 2),
      lastMoveTime: Date.now()
    };
    return block;
  }


  function getBlockWidth(blockType) {
    var shapes = {
      I: 4,
      O: 2,
      T: 3,
      S: 3,
      Z: 3,
      J: 3,
      L: 3
    };
    return shapes[blockType];
  }

 
  function getBlockColor(blockType) {
    var colors = {
      I: "cyan",
      O: "yellow",
      T: "purple",
      S: "green",
      Z: "red",
      J: "blue",
      L: "orange"
    };
    return colors[blockType];
  }

 
  function getBlockShape(blockType) {
    var shapes = {
      I: [[1, 1, 1, 1]],
      O: [[1, 1], [1, 1]],
      T: [[0, 1, 0], [1, 1, 1]],
      S: [[0, 1, 1], [1, 1, 0]],
      Z: [[1, 1, 0], [0, 1, 1]],
      J: [[1, 0, 0], [1, 1, 1]],
      L: [[0, 0, 1], [1, 1, 1]]
    };
    return shapes[blockType];
  }

  
  function drawBlock(block) {
    for (var i = 0; i < block.shape.length; i++) {
      for (var j = 0; j < block.shape[i].length; j++) {
        if (block.shape[i][j] === 1) {
          var row = block.row + i;
          var col = block.col + j;
          if (row >= 0 && row < 20 && col >= 0 && col < 10 && block.shape[i] && block.shape[i][j] !== undefined) {
            var cell = $("#gameBoard").children(".row").eq(row).children(".cell").eq(col);
            cell.css("background-color", block.color);
          }
        }
      }
    }
  }

 
  function drawNextBlock(block) {
    $("#nextBlockArea").empty();
    for (var i = 0; i < block.shape.length; i++) {
      var row = $("<div class='next-row'></div>");
      for (var j = 0; j < block.shape[i].length; j++) {
        var cell = $("<div class='next-cell'></div>");
        if (block.shape[i][j] === 1) {
          cell.css("background-color", block.color);
        }
        row.append(cell);
      }
      $("#nextBlockArea").append(row);
    }
  }

  
function moveBlockDown() {
    if (canMoveDown(currentBlock)) {
        undrawBlock(currentBlock);
        currentBlock.row++;
        drawBlock(currentBlock);
    }
}
function canMoveDown(block) {
  for (var j = 0; j < block.shape[0].length; j++) {
      var lowestRowInColumn = -1; 
      for (var i = 0; i < block.shape.length; i++) { 
          if (block.shape[i][j] === 1) {
              lowestRowInColumn = i; 
          }
      }

      if (lowestRowInColumn !== -1) { 
          var cellRow = block.row + lowestRowInColumn + 1; 
          var cellCol = block.col + j;
          if (cellRow >= 20) { 
              return false;
          }
          var cell = $("#gameBoard").children(".row").eq(cellRow).children(".cell").eq(cellCol);
          if (cell.css("background-color") !== "rgba(0, 0, 0, 0)") {
              return false; 
          }
      }
  }
  return true; 
}


  
  function undrawBlock(block) {
    for (var i = 0; i < block.shape.length; i++) {
      for (var j = 0; j < block.shape[i].length; j++) {
        if (block.shape[i][j] === 1) {
          var cell = $("#gameBoard").children(".row").eq(block.row + i).children(".cell").eq(block.col + j);
          cell.css("background-color", "");
        }
      }
    }
  }

  function checkForCompleteRows() {
    let completeRows = [];
    $("#gameBoard .row").each(function(index) {
      let row = $(this);
      let isComplete = true;
  
      row.children(".cell").each(function() {
        if ($(this).css("background-color") === "rgba(0, 0, 0, 0)" || $(this).hasClass("currentBlock")) {
          isComplete = false;
          return false; 
        }
      });
  
      if (isComplete) {
        completeRows.push(index);
      }
    });
  
    if (completeRows.length > 0) {
      removeCompleteRows(completeRows);
      updateScore(completeRows.length);
    }
  
    $("#gameBoard .cell").removeClass("currentBlock");
  }


function removeCompleteRows(rows) {
  for (var i = rows.length - 1; i >= 0; i--) {
    $("#gameBoard").children(".row").eq(rows[i]).remove();
  }
  for (var i = 0; i < rows.length; i++) {
    var newRow = $("<div class='row'></div>");
    for (var j = 0; j < 10; j++) {
      var cell = $("<div class='cell'></div>");
      newRow.append(cell);
    }
    $("#gameBoard").prepend(newRow);
  }
}


  function updateScore(completedRows) {
    var points = [0, 40, 100, 300, 1200];
    score += points[completedRows] * level;
    $("#score").text(score);
  

    if (score >= (level * 100)) {
      gameSpeed -= 100;
      if (gameSpeed < 100) {
        gameSpeed = 100; 
      }
    
    }
  
    if (score >= level * 100) {
      level++;
      $("#level").text(level);
    }
  }

  function isGameOver(block) {
    if (!block) {
      return false;
    }
  
    for (let i = 0; i < block.shape.length; i++) {
      for (let j = 0; j < block.shape[i].length; j++) {
        if (block.shape[i][j] === 1) {
          let row = block.row + i;
          let col = block.col + j;
    
          if (row < 0 || row >= 20 || col < 0 || col >= 10 || 
              ($("#gameBoard").children(".row").eq(row).children(".cell").eq(col).css("background-color") !== "rgba(0, 0, 0, 0)")) { 
            return true; 
          }
        }
      }
    }
    
  
    return false; 
  }

  function getSelectedLevel() {
    var urlParams = new URLSearchParams(window.location.search);
    var selectedLevel = urlParams.get("level");
    return selectedLevel ? decodeURIComponent(selectedLevel) : "easy";
  }

  function endGame() {
    cancelAnimationFrame(requestId);
    $(document).off("keydown", handleKeyPress);
  
    var playerName = prompt("Enter your username:");
    if (playerName) {
      saveResult(playerName, score);
      window.location.href = "tetris-results.html?name=" + encodeURIComponent(playerName) + "&score=" + score;
    } else {
      window.location.href = "tetris-instructions.html";
    }
  }
  
  function saveResult(playerName, score) {
    var results = JSON.parse(localStorage.getItem("tetrisResults")) || [];
    var newResult = {
      name: playerName,
      score: score
    };
    results.push(newResult);
    results.sort(function(a, b) {
      return b.score - a.score;
    });
    localStorage.setItem("tetrisResults", JSON.stringify(results));
  }

function handleKeyPress(event) {


  switch (event.key) {
    case "ArrowLeft": 
      moveBlockLeft();
      break;
    case "ArrowRight": 
      moveBlockRight();
      break;
    case "ArrowDown":  
      moveBlockDown();
      break;
    case "ArrowUp":    
      rotateBlock();
      break;
  }
}



function moveBlockLeft() {
  if (canMoveLeft(currentBlock)) {
    undrawBlock(currentBlock);
    currentBlock.col--;
    drawBlock(currentBlock);
  }
}

function canMoveLeft(block) {
 
  let leftMostColumns = Array(block.shape.length).fill(null);

  
  for (var i = 0; i < block.shape.length; i++) {
    for (var j = 0; j < block.shape[i].length; j++) {
      if (block.shape[i][j] === 1) {
        if (leftMostColumns[i] === null || j < leftMostColumns[i]) {
          leftMostColumns[i] = j;
        }
      }
    }
  }

  for (var i = 0; i < leftMostColumns.length; i++) {
    if (leftMostColumns[i] !== null) {
      var nextCol = block.col + leftMostColumns[i] - 1;
      if (nextCol < 0) return false; // Provera da li je kolona izvan granica
      var cell = $("#gameBoard .row").eq(block.row + i).find(".cell").eq(nextCol);
      if (cell.css("background-color") !== "rgba(0, 0, 0, 0)") {
        return false; 
      }
    }
  }

  return true; 
}


  function moveBlockRight() {
    if (canMoveRight(currentBlock)) {
      undrawBlock(currentBlock);
      currentBlock.col++;
      drawBlock(currentBlock);
    }
  }

  function canMoveRight(block) {
    let rightMostColumns = Array(block.shape.length).fill(null);

    for (var i = 0; i < block.shape.length; i++) {
        for (var j = 0; j < block.shape[i].length; j++) {
            if (block.shape[i][j] === 1) {
                if (rightMostColumns[i] === null || j > rightMostColumns[i]) {
                    rightMostColumns[i] = j;
                }
            }
        }
    }

    for (var i = 0; i < rightMostColumns.length; i++) {
        if (rightMostColumns[i] !== null) {
            var nextCol = block.col + rightMostColumns[i] + 1;
            if (nextCol >= 10) return false;
            var cell = $("#gameBoard .row").eq(block.row + i).find(".cell").eq(nextCol);
            if (cell.css("background-color") !== "rgba(0, 0, 0, 0)") {
                return false; 
            }
        }
    }

    return true;
}


  function rotateBlock() {
      var rotatedShape = rotateClockwise(currentBlock.shape);
      if (canRotate(currentBlock, rotatedShape)) {
          undrawBlock(currentBlock); 
          currentBlock.shape = rotatedShape;  
          drawBlock(currentBlock); 
      }
  }

  function rotateClockwise(shape) {
      return shape[0].map((val, index) => shape.map(row => row[index]).reverse());
  }

  function canRotate(block, rotatedShape) {
    for (var i = 0; i < rotatedShape.length; i++) {
        for (var j = 0; j < rotatedShape[i].length; j++) {
            if (rotatedShape[i][j] === 1) {
                var newRow = block.row + i;
                var newCol = block.col + j;
                if (newRow < 0 || newRow >= 20 || newCol < 0 || newCol >= 10) {
                    return false;
                }
                var cell = $("#gameBoard").children(".row").eq(newRow).children(".cell").eq(newCol);
                if (cell.hasClass("occupied")) {
                    return false; 
                }
            }
        }
    }
    return true;
}


initializeGame();
};
