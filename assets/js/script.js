// Start of Spotify Web API ------------------------
const clientId = '65db5ee62bd54c539ab09c21d723eec3';
const clientSecret = 'dd48590eba584fa4b97c4f25d91dffad';
const redirectUri = 'https://elitehuskie.github.io/project-01-music-lyrics-game/';

// Function to initiate the authentication process
function authenticateWithSpotify() {
  // Construct the authorization URL
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private%20user-read-email`;

  // Redirect the user to the Spotify authorization URL
  window.location.href = authUrl;
}

// Function to handle the authorization code exchange
function handleAuthorizationCode(code) {
  // Make a request to your server-side endpoint to exchange the authorization code for an access token
  fetch('/https://elitehuskie.github.io/project-01-music-lyrics-game/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: code,
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: redirectUri
    })
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response from your server-side endpoint
    const accessToken = data.access_token;
    const expiresIn = data.expires_in;
    console.log(accessToken)
    // Perform further actions with the access token, such as making API requests
  })
  .catch(error => {
    console.error('Error exchanging authorization code:', error);
  });
}

// Code to handle the callback from the Spotify authorization flow
const urlParams = new URLSearchParams(window.location.search);
const authorizationCode = urlParams.get('code');

if (authorizationCode) {
  handleAuthorizationCode(authorizationCode);
}
// Start of MusixMatch API -----------------------
const apiKey = '3be68bfc0da7e2c5a81fff0c26329572';
const trackId = '31409936';

fetch(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Your code for handling the response data here
  })
  .catch(error => {
    console.error(error);
    // Your error handling code here
  });

const player = {
  name: 'placeHolder',
  score: 0
};

// These two lines convert the string words of the lyrics_body provided from
// the API as well as the user's guesses into arrays
const user_lyrics_input = user_input.split(' ');
const lyrics_array = lyrics_body.split(' ');

// Calculates the percentage of words guessed correctly
let words_correct = 0;
let words_incorrect = 0;

// Compares the lyrics of the user and the lyrics of the song
// and prints green or red depending on whether they match
for (let i = 0; i < user_lyrics_input.length; i++) {
  if (user_lyrics_input[i] === lyrics_array[i]) {
    // Wrap the word in a span element and apply styles
    user_lyrics_input[i] = `<span style="color: green;">${user_lyrics_input[i]}</span>`;
    words_correct++;
  } else {
    // Wrap the word in a span element and apply styles
    user_lyrics_input[i] = `<span style="color: red;">${user_lyrics_input[i]}</span>`;
    words_incorrect++;
  }
}

// Calculates the total number of words entered
const words_entered = words_incorrect + words_correct;
const scorePercentage = (words_correct / words_entered) * 100;

// Join the styled words back into a string
const styled_lyrics = user_lyrics_input.join(' ');

// Display the styled lyrics
const outputElement = document.getElementById('Lyricscroll');
outputElement.innerHTML = styled_lyrics;

let Lyrics_body_Index = 0;
function lyricScroll() {
  if (Lyrics_body_Index < lyrics_array.length) {
    outputElement.textContent = lyrics_array[Lyrics_body_Index];
    Lyrics_body_Index++;
  }
}

// Call the lyricScroll function to initiate the scrolling
lyricScroll();