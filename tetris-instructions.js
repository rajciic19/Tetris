function startGame(event) {
  event.preventDefault();

  var selectedBlocks = [];
  var blockOptions = document.querySelectorAll('.block-option.selected');
  blockOptions.forEach(function(blockOption) {
    selectedBlocks.push(blockOption.getAttribute('data-block'));
  });

  var selectedLevel = document.getElementById("level").value;

  var url = "tetris-game.html?blocks=" + encodeURIComponent(JSON.stringify(selectedBlocks)) + "&level=" + encodeURIComponent(selectedLevel);
  window.location.href = url;
}

document.addEventListener('DOMContentLoaded', function() {
  var blockOptions = document.querySelectorAll('.block-option');
  blockOptions.forEach(function(blockOption) {
    blockOption.addEventListener('click', function() {
      blockOption.classList.toggle('selected');
    });
  });
});