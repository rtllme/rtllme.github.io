// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5yMW_YkKI8seU1r503Di7mzmcghneNUs",
  authDomain: "word-impostor-6c242.firebaseapp.com",
  projectId: "word-impostor-6c242",
  storageBucket: "word-impostor-6c242.firebasestorage.app",
  messagingSenderId: "999427570426",
  appId: "1:999427570426:web:54ed41f710070413636743",
  databaseURL: "https://word-impostor-6c242-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to get or create a player ID
function getOrCreatePlayerId() {
  // Retrieve the player ID from localStorage, or generate a new one if not found
  let playerId = localStorage.getItem("playerId");
  if (!playerId) {
      playerId = crypto.randomUUID(); // Generate a UUID for the player
      localStorage.setItem("playerId", playerId); // Store it in localStorage
  }
  return playerId;
}

// Initialize playerId and roomCode variables
let playerId = getOrCreatePlayerId();
let roomCode = null; // Room code will be set after loading the page

// On page load, fetch the room code and update the UI
window.onload = function() {
  // Get the room code from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  roomCode = urlParams.get('roomCode');  // Retrieve the room code from the URL

  if (roomCode) {
      // Display the room code on the page
      document.getElementById("roomCodeDisplay").textContent = roomCode;

      // Fetch room data from Firebase
      firebase.database().ref('rooms/' + roomCode).once('value').then(function(snapshot) {
          const roomData = snapshot.val();
          console.log(roomData);  // Log room data for debugging
      });

      // Display the players list in real-time
      const playerListElement = document.getElementById("playerList");
      const roomRef = firebase.database().ref('rooms/' + roomCode + '/players');

      // Real-time listener for players in the room
      roomRef.on('value', function(snapshot) {
          const players = snapshot.val();
          playerListElement.innerHTML = ''; // Clear existing players

          // Loop through the players and display their names
          for (const playerId in players) {
              const li = document.createElement('li');
              li.textContent = players[playerId].name;
              playerListElement.appendChild(li);
          }
      });
  } else {
      console.log("Room code not found!");  // Handle missing room code
  }
};

// Function to quit the room
function quitRoom() {
  // Remove the player from the room in Firebase
  firebase.database().ref('rooms/' + roomCode + '/players/' + playerId).remove();
  window.location.href = "index.html";  // Redirect to the main page
}

// Function to start the game
// Function to start the game
function startGame() {
  // Check if the player is the host
  database.ref('rooms/' + roomCode).once('value').then(snapshot => {
      const roomData = snapshot.val();

      if (roomData) {
          if (roomData.host === playerId) {
              console.log("Starting the game...");

              // Update the room status to 'started'
              database.ref('rooms/' + roomCode).update({
                  status: "started"
              }).catch((error) => {
                  console.error("Error starting the game:", error);
              });
          } else {
              alert("You are not the host and cannot start the game.");
          }
      } else {
          console.error("Room not found.");
      }
  }).catch((error) => {
      console.error("Error checking room data:", error);
  });
}

function checkRoomStatus() {
  // Real-time listener for status change
  database.ref('rooms/' + roomCode).on('value', function(snapshot) {
    const roomData = snapshot.val();

    // Log the room data for debugging
    console.log(roomData);

    // Ensure roomData is not null or undefined before accessing properties
    if (roomData && roomData.status === "started") {
      console.log("Game has started, redirecting players...");
      window.location.replace("game.html?roomCode=" + roomCode);
    } else {
      console.log("Room not found or status not started.");
    }
  });
}
setInterval(checkRoomStatus, 2000);


