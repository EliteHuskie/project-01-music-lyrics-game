//never gonna give you up, never gonna let you down! 
//GET RICK ROLLED SON!!

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

//const apiKey = '3be68bfc0da7e2c5a81fff0c26329572';
//const trackId = '31409936'; 
//fetch(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${apiKey}`)
  //.then(response => response.json())
  //.then(data => {
    
 //console.log(data);
  //})
 // .catch(error => {
    
    //console.log(error);
 // });

//these two lines convert the string words of the lyrics_body provided from 
//the API as well as the users guesses into arrays
//const user_lyrics_input = user_input.split(" ");
//const lyrics_array = lyrics_body.split(" ");

//calculates the percentage of words guessed correctly
//let words_correct = 0;
//let words_incorrect = 0;
//let words_entered = words_incorrect + words_correct;
//let scorePercentage = ((words_correct/words_entered) * 100);

//compares the lyrics of the user and the lyrics of the song, 
// and prints green or red depending on whether they match
//for (let i = 0; i < user_lyrics_input.length; i++) {
  //  if (user_lyrics_input[i] === actual_lyrics[i]) {
    //    user_lyrics_input[i].style.color = "green";
      //  words_correct++
        
    //} else {
      //  user_lyrics_input[i].style.color = "red";
        //words_incorrect++
    //}
//};

//const outputElement = document.getElementById("Lyricscroll");
//let Lyrics_body_Index = 0;
//function lyricScroll () {
  //  if (Lyrics_body_Index < lyrics_array)
    //outputElement.textContent = array[lyrics_array];
    //Lyrics_body_Index++;
//}

//we need to append the lyrics from the lyrics body given by 
//the API to the actual_lyrics array and then print that out
//at the same rate as the song is singing them

//if we use a for loop, we can keep track of the 
//indexs of the array so that the comparison function
//knows which indexs to compare. 
