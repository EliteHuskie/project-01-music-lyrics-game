var client_id = ""; 
var client_secret = ""; 
var access_token = null;
var refresh_token = null;
var currentPlaylist = "";
var radioButtons = [];
var redirect_uri = "https://scoges.github.io/spotitest/assets/lyric-lord.html";


const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const PAUSE = "https://api.spotify.com/v1/me/player/pause";
const NEXT = "https://api.spotify.com/v1/me/player/next";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const PLAYER = "https://api.spotify.com/v1/me/player";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";


function onPageLoad(){
  client_id = localStorage.getItem("client_id");
  client_secret = localStorage.getItem("client_secret");
  if ( window.location.search.length > 0 ){
      handleRedirect();
  }
  else{
      access_token = localStorage.getItem("access_token");
      if ( access_token == null ){
          // we don't have an access token so present token section
          document.getElementById("tokenSection").style.display = 'block';  
      }
      else {
          // we have an access token so present device section
          document.getElementById("deviceSection").style.display = 'block';  
          refreshDevices();
          refreshPlaylists();
          currentlyPlaying();
      }
  }
  refreshRadioButtons();
}

function handleRedirect(){
  let code = getCode();
  fetchAccessToken( code );
  window.history.pushState("", "", redirect_uri); // remove param from url
}

function getCode(){
  let code = null;
  const queryString = window.location.search;
  if ( queryString.length > 0 ){
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code')
  }
  return code;
}

function requestAuthorization(){
  client_id = document.getElementById("clientId").value;
  client_secret = document.getElementById("clientSecret").value;
  localStorage.setItem("client_id", client_id);
  localStorage.setItem("client_secret", client_secret); // In a real app you should not expose your client_secret to the user

  let url = AUTHORIZE;
  url += "?client_id=" + client_id;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  window.location.href = url; // Show Spotify's authorization screen
}

function fetchAccessToken( code ){
  let body = "grant_type=authorization_code";
  body += "&code=" + code; 
  body += "&redirect_uri=" + encodeURI(redirect_uri);
  body += "&client_id=" + client_id;
  body += "&client_secret=" + client_secret;
  callAuthorizationApi(body);
}

function refreshAccessToken(){
  refresh_token = localStorage.getItem("refresh_token");
  let body = "grant_type=refresh_token";
  body += "&refresh_token=" + refresh_token;
  body += "&client_id=" + client_id;
  callAuthorizationApi(body);
}

function callAuthorizationApi(body){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", TOKEN, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      console.log(data);
      var data = JSON.parse(this.responseText);
      if ( data.access_token != undefined ){
          access_token = data.access_token;
          localStorage.setItem("access_token", access_token);
      }
      if ( data.refresh_token  != undefined ){
          refresh_token = data.refresh_token;
          localStorage.setItem("refresh_token", refresh_token);
      }
      onPageLoad();
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}

function refreshDevices(){
  callApi( "GET", DEVICES, null, handleDevicesResponse );
}

function handleDevicesResponse(){
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      console.log(data);
      removeAllItems( "devices" );
      data.devices.forEach(item => addDevice(item));
  }
  else if ( this.status == 401 ){
      refreshAccessToken()
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}

function addDevice(item){
  let node = document.createElement("option");
  node.value = item.id;
  node.innerHTML = item.name;
  document.getElementById("devices").appendChild(node); 
}

function callApi(method, url, body, callback){
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.send(body);
  xhr.onload = callback;
}

function refreshPlaylists(){
  callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
}

function handlePlaylistsResponse(){
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      console.log(data);
      removeAllItems( "playlists" );
      data.items.forEach(item => addPlaylist(item));
      document.getElementById('playlists').value=currentPlaylist;
  }
  else if ( this.status == 401 ){
      refreshAccessToken()
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}

function addPlaylist(item){
  let node = document.createElement("option");
  node.value = item.id;
  node.innerHTML = item.name + " (" + item.tracks.total + ")";
  document.getElementById("playlists").appendChild(node); 
}

function removeAllItems( elementId ){
  let node = document.getElementById(elementId);
  while (node.firstChild) {
      node.removeChild(node.firstChild);
  }
}

function play(){
  let playlist_id = document.getElementById("playlists").value;
  let trackindex = document.getElementById("tracks").value;
  let album = document.getElementById("album").value;
  let body = {};
  if ( album.length > 0 ){
      body.context_uri = album;
  }
  else{
      body.context_uri = "spotify:playlist:" + playlist_id;
  }
  body.offset = {};
  body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
  body.offset.position_ms = 0;
  callApi( "PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );
}

function shuffle(){
  callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId(), null, handleApiResponse );
  play(); 
}

function pause(){
  callApi( "PUT", PAUSE + "?device_id=" + deviceId(), null, handleApiResponse );
}

function next(){
  callApi( "POST", NEXT + "?device_id=" + deviceId(), null, handleApiResponse );
}

function previous(){
  callApi( "POST", PREVIOUS + "?device_id=" + deviceId(), null, handleApiResponse );
}

function transfer(){
  let body = {};
  body.device_ids = [];
  body.device_ids.push(deviceId())
  callApi( "PUT", PLAYER, JSON.stringify(body), handleApiResponse );
}

function handleApiResponse(){
  if ( this.status == 200){
      console.log(this.responseText);
      setTimeout(currentlyPlaying, 2000);
  }
  else if ( this.status == 204 ){
      setTimeout(currentlyPlaying, 2000);
  }
  else if ( this.status == 401 ){
      refreshAccessToken()
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }    
}

function deviceId(){
  return document.getElementById("devices").value;
}

function fetchTracks(){
  let playlist_id = document.getElementById("playlists").value;
  if ( playlist_id.length > 0 ){
      url = TRACKS.replace("{{PlaylistId}}", playlist_id);
      callApi( "GET", url, null, handleTracksResponse );
  }
}

function handleTracksResponse(){
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      console.log(data);
      removeAllItems( "tracks" );
      data.items.forEach( (item, index) => addTrack(item, index));
  }
  else if ( this.status == 401 ){
      refreshAccessToken()
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}

function addTrack(item, index){
  let node = document.createElement("option");
  node.value = index;
  node.innerHTML = item.track.name + " (" + item.track.artists[0].name + ")";
  document.getElementById("tracks").appendChild(node); 
}

function currentlyPlaying(){
  callApi( "GET", PLAYER + "?market=US", null, handleCurrentlyPlayingResponse );
}

function handleCurrentlyPlayingResponse(){
  if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      console.log(data);
      if ( data.item != null ){
          document.getElementById("albumImage").src = data.item.album.images[0].url;
          document.getElementById("trackTitle").innerHTML = data.item.name;
          document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
      }


      if ( data.device != null ){
          // select device
          currentDevice = data.device.id;
          document.getElementById('devices').value=currentDevice;
      }

      if ( data.context != null ){
          // select playlist
          currentPlaylist = data.context.uri;
          currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
          document.getElementById('playlists').value=currentPlaylist;
      }
  }
  else if ( this.status == 204 ){

  }
  else if ( this.status == 401 ){
      refreshAccessToken()
  }
  else {
      console.log(this.responseText);
      alert(this.responseText);
  }
}

function saveNewRadioButton(){
  let item = {};
  item.deviceId = deviceId();
  item.playlistId = document.getElementById("playlists").value;
  radioButtons.push(item);
  localStorage.setItem("radio_button", JSON.stringify(radioButtons));
  refreshRadioButtons();
}

function refreshRadioButtons(){
  let data = localStorage.getItem("radio_button");
  if ( data != null){
      radioButtons = JSON.parse(data);
      if ( Array.isArray(radioButtons) ){
          removeAllItems("radioButtons");
          radioButtons.forEach( (item, index) => addRadioButton(item, index));
      }
  }
}

function onRadioButton( deviceId, playlistId ){
  let body = {};
  body.context_uri = "spotify:playlist:" + playlistId;
  body.offset = {};
  body.offset.position = 0;
  body.offset.position_ms = 0;
  callApi( "PUT", PLAY + "?device_id=" + deviceId, JSON.stringify(body), handleApiResponse );
  //callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId, null, handleApiResponse );
}

function addRadioButton(item, index){
  let node = document.createElement("button");
  node.className = "btn btn-primary m-2";
  node.innerText = index;
  node.onclick = function() { onRadioButton( item.deviceId, item.playlistId ) };
  document.getElementById("radioButtons").appendChild(node);
}

        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = 'access_token';
            const player = new Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                getOAuthToken: callback => { callback(token); },
                volume: 0.5
            });

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('initialization_error', ({ message }) => {
                console.error(message);
            });

            player.addListener('authentication_error', ({ message }) => {
                console.error(message);
            });

            player.addListener('account_error', ({ message }) => {
                console.error(message);
            });

            document.getElementById('togglePlay').onclick = function() {
              player.togglePlay();
            };

            player.connect();
        }

// Start of Musixmatch API
// Variables for apiKey and trackID
const apiKey = '3be68bfc0da7e2c5a81fff0c26329572';
const trackId = '31409936';
let lyricsArray = [];
let currentIndex = 0;
let endIndex = 0;
let user_lyrics_guess = [];
let lyricsRetrieved = true; // Flag to track if lyrics have been retrieved

// Function to highlight words based on correctness
function highlightWords() {
  const displayElement = document.getElementById('displayText');
  const words = displayElement.getElementsByTagName('span');

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const userWord = user_lyrics_guess[i] || ''; // Get the corresponding user input word or an empty string if it doesn't exist

    if (userWord.trim() === word.textContent.trim()) {
      word.style.color = 'green';
    } else {
      word.style.color = 'red';
    }
  }
}

// Function to display lyrics on the page
function displayLyrics() {
  const displayElement = document.getElementById('displayText');
  displayElement.innerHTML = lyricsArray
    .slice(0, endIndex)
    .map(word => `<span>${word}</span>`)
    .join(' ');

  // Show the lyrics element
  displayElement.style.display = 'block';
}

// Make the API request to retrieve lyrics
function retrieveLyrics() {
  const url = `https://proxy.cors.sh/https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${apiKey}`;

  fetch(url, {
    headers: {
      'x-cors-api-key': 'temp_8587e07d4da904fa8673aa9008ec635d',
    },
  })
    .then(response => response.json())
    .then(data => {
      const lyricsBody = data.message.body.lyrics.lyrics_body;

      // Remove newline characters from lyrics
      const lyricsWithoutNewlines = lyricsBody.replace(/\n/g, ' ');

      lyricsArray = lyricsWithoutNewlines.split(' ');
      endIndex = Math.min(lyricsArray.length, 10); // Limit to the first 10 words
      lyricsRetrieved = true; // Set the flag to true
    })
    .catch(error => {
      console.log('Fetch Error:', error);
    });
}

// Function to compare user input with lyrics and update scores
function compareWords() {
  const lastTenWords = lyricsArray.slice(0, endIndex);
  const userGuess = user_lyrics_guess.slice(0, endIndex);

  const wordsWrong = lastTenWords.reduce((count, word, index) => {
    if (userGuess[index] !== word && userGuess[index] !== word.replace(/\n/g, '')) {
      return count + 1;
    }
    return count;
  }, 0);

  const totalWords = lastTenWords.length;

  const score = Math.round(((totalWords - wordsWrong) / totalWords) * 100 * 100) / 100;

  // Save score to local storage
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  const urlParams = new URLSearchParams(window.location.search);
  const scoreValue = urlParams.get('score');
  scores.push(scoreValue);
  localStorage.setItem('scores', JSON.stringify(scores));

  // Update high scores display
  updateHighScores(score);

  return { score, wordsWrong, totalWords };
}

// Event listener for the "Finish Game" button
const finishGameButton = document.getElementById('finishGame');
finishGameButton.addEventListener('click', function () {
  // Compare user input with lyrics and calculate score
  const { score } = compareWords();

  // Open the modal to collect initials
  openModal();

  // Event listener for the "Submit" button in the modal
  const submitInitialsButton = document.getElementById('submitInitialsButton');
  submitInitialsButton.addEventListener('click', function () {
    const playerInitials = initialsInput.value;

    // Redirect to the high-scores page with the score and initials as query parameters
    window.location.href = `high-scores.html?score=${score}&initials=${playerInitials}`;
  });
});

// Check if the input element exists before adding the event listener
const inputTextbox = document.getElementById('inputTextbox');
if (inputTextbox) {
  // Add event listener for keydown event on the input element
  inputTextbox.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default behavior of the Enter key

      if (!lyricsRetrieved) {
        console.log('Lyrics have not been retrieved yet');
        return;
      }

      // Display the lyrics on the page
      displayLyrics();

      const inputText = inputTextbox.value;
      user_lyrics_guess = inputText.split(' ');

      // Keep only the last 10 words of user's guess
      user_lyrics_guess = user_lyrics_guess.slice(-10);

      // Compare user input with lyrics and calculate score
      const { score, wordsWrong, totalWords } = compareWords();
      updateHighScores(score);

      // Clear the input textbox after processing
      inputTextbox.value = '';

      // Highlight the words based on correctness
      highlightWords();

      // Check if the user has completed the lyrics (reached the end)
      if (currentIndex >= endIndex) {
        // Show the "Finish Game" button
        finishGameButton.style.display = 'block';
      }
    }
  });
}

// Function to update high scores page with the score
function updateHighScores(score) {
  const scoreDisplay = document.getElementById('scoreDisplay');
  if (scoreDisplay) {
    scoreDisplay.textContent = `Score: ${score}%`;
  }
}

// Call the function to update the high scores display
updateHighScores();

// Call the function to retrieve lyrics
retrieveLyrics();