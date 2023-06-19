// Retrieve the score and initials from the query parameters
const urlParams = new URLSearchParams(window.location.search);
const scoreValue = urlParams.get('score');
const initialsValue = urlParams.get('initials');

// Display the score and initials on the page
const scoreDisplay = document.getElementById('scoreDisplay');

if (scoreValue && initialsValue) {
  scoreDisplay.textContent = `Score: ${scoreValue}% - Initials: ${initialsValue}`;
} else {
  scoreDisplay.textContent = 'No Highscores Yet!';
}

// Clear scores button functionality
const clearScoresButton = document.getElementById('clearScoresButton');
clearScoresButton.addEventListener('click', function () {
  // Clear the scores from local storage
  localStorage.removeItem('scores');

  // Optionally, update the display or provide a confirmation message
  scoreDisplay.textContent = 'No Highscores Yet!';
});