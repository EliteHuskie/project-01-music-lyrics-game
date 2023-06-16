const clientId = 'placeholder';
const clientSecret = 'placeholder';
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
      console.log(accessToken);
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

const apiKey = '123';
const trackId = '31409936';

 //This code displays each word of the lyrics retreaved from the API
 //and displays everything except 8 words
 const lyricsBody = jsonResponse.message.body.lyrics.lyrics_body;
 const lyricsArray = lyricsBody.split(' ');
 
 //needs the HTML element to be proper!!!!!!!!!!!!!!!!!!!!!!!
 const container = document.getElementById('lyricsContainer');
 const startIndex = 0;
 const endIndex = lyricsArray.length - 8;
 let currentIndex = startIndex;
 
 function displayNextWord() {
   if (currentIndex < endIndex) {
     const word = lyricsArray[currentIndex];
     const wordElement = document.createElement('span');
     wordElement.textContent = word + ' ';
     container.appendChild(wordElement);
     currentIndex++;
   }
 }
 
 setInterval(displayNextWord, 50); 

 //This function turns the users imput into an array 

 let user_lyrics_guess = [];

 //needs the HTML element to be proper!!!!!!!!!!!!!!!!!!!!!!
 function convertInputToArray() {
  const inputText = document.getElementById('inputTextbox').value;
  user_lyrics_guess.push(...inputText.split(' '));
  console.log(user_lyrics_guess);
}

const lastEightWords = lyricsArray.slice(-8);

//needs the HTML element to be proper!!!!!!!!!!!!!!!!!!!!!!!
function compareWords() {
  const userInput = document.getElementById('inputTextbox').value;
  const userArray = userInput.split(' ');

  const result = lyricsArray.map((word) => {
    if (lastEightWords.includes(word)) {
      return '<span style="color: green;">' + word + '</span>';
    } else {
      return '<span style="color: red;">' + word + '</span>';
    }
  });

  const displayElement = document.getElementById('displayText');
  displayElement.innerHTML = result.join(' ');
}
